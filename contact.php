<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Cache-Control: no-store, max-age=0');

const RECIPIENT = 'info@inducleanservices.nl';
const WEBSITE_URL = 'https://inducleanservices.nl';
const FORM_KEY = 'induclean-contact-2026';

function redirect_to(string $location): void
{
    header('Location: ' . $location, true, 303);
    exit;
}

function post_value(string $name, int $maximumLength): string
{
    $value = $_POST[$name] ?? '';
    if (!is_string($value)) {
        return '';
    }

    $value = trim(str_replace("\0", '', $value));
    return substr($value, 0, $maximumLength);
}

function safe_header_value(string $value): string
{
    return trim(str_replace(["\r", "\n"], '', $value));
}

function display_value(string $value): string
{
    return $value !== '' ? $value : '-';
}

function send_message(string $recipient, string $subject, string $message, string $replyTo): bool
{
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $headers = implode("\r\n", [
        'From: Induclean Website <' . RECIPIENT . '>',
        'Reply-To: ' . safe_header_value($replyTo),
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'X-Mailer: Induclean Website',
    ]);

    $sent = mail($recipient, $encodedSubject, $message, $headers, '-f' . RECIPIENT);
    if (!$sent) {
        $sent = mail($recipient, $encodedSubject, $message, $headers);
    }

    return $sent;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    http_response_code(405);
    echo 'Alleen formulierverzendingen zijn toegestaan.';
    exit;
}

$submittedFormKey = post_value('form_key', 100);
if (!hash_equals(FORM_KEY, $submittedFormKey)) {
    http_response_code(403);
    echo 'Deze aanvraag kon niet worden gecontroleerd.';
    exit;
}

// Bots vullen dit voor normale bezoekers onzichtbare veld vaak wel in.
if (post_value('_honey', 200) !== '') {
    http_response_code(204);
    exit;
}

$name = post_value('naam', 120);
$organization = post_value('organisatie', 160);
$email = post_value('email', 254);
$phone = post_value('telefoon', 80);
$service = post_value('dienst', 120);
$location = post_value('locatie', 160);
$locationType = post_value('locatie_type', 120);
$urgency = post_value('spoed', 120);
$contactPreference = post_value('contactvoorkeur', 120);
$desiredDate = post_value('gewenste_uitvoerdatum', 40);
$message = post_value('bericht', 5000);
$privacyAccepted = post_value('privacy-akkoord', 10) === 'Ja';

$leadId = post_value('lead_id', 120);
$landingPage = post_value('landingspagina', 1000);
$referrer = post_value('verwijzer', 1000);
$utmSource = post_value('utm_source', 240);
$utmMedium = post_value('utm_medium', 240);
$utmCampaign = post_value('utm_campaign', 240);
$utmTerm = post_value('utm_term', 240);
$utmContent = post_value('utm_content', 240);
$gclid = post_value('gclid', 300);
$gbraid = post_value('gbraid', 300);
$wbraid = post_value('wbraid', 300);

$allowedServices = [
    'Reiniging',
    'Steigerbouw',
    'Gevelonderhoud',
    'VvE onderhoud',
    'Vastgoedonderhoud',
    'Specialistische reiniging / calamiteit',
    'Specialistische / urgente reiniging',
    'Ontruiming en hoarding',
    'Industriële reiniging',
    'Schimmel, desinfectie of sanering',
    'Andere reinigingsvraag',
    'Anders',
];

$validSubmission = strlen($name) >= 2
    && filter_var($email, FILTER_VALIDATE_EMAIL) !== false
    && in_array($service, $allowedServices, true)
    && strlen($message) >= 10
    && $privacyAccepted;

if (!$validSubmission) {
    redirect_to('/?form=invalid#contact');
}

date_default_timezone_set('Europe/Amsterdam');
$receivedAt = date('d-m-Y H:i');

$mailBody = implode("\r\n", [
    'Nieuwe websiteaanvraag voor Induclean',
    '--------------------------------------',
    'Ontvangen: ' . $receivedAt,
    'Lead-ID: ' . display_value($leadId),
    '',
    'Naam: ' . $name,
    'Organisatie: ' . display_value($organization),
    'E-mail: ' . $email,
    'Telefoon: ' . display_value($phone),
    'Contactvoorkeur: ' . display_value($contactPreference),
    '',
    'Dienst: ' . $service,
    'Locatie of postcode: ' . display_value($location),
    'Type locatie: ' . display_value($locationType),
    'Gewenste termijn: ' . display_value($urgency),
    'Gewenste uitvoerdatum: ' . display_value($desiredDate),
    '',
    'Toelichting:',
    $message,
    '',
    'Campagneherkomst',
    '-----------------',
    'Landingspagina: ' . display_value($landingPage),
    'Verwijzer: ' . display_value($referrer),
    'UTM source: ' . display_value($utmSource),
    'UTM medium: ' . display_value($utmMedium),
    'UTM campaign: ' . display_value($utmCampaign),
    'UTM term: ' . display_value($utmTerm),
    'UTM content: ' . display_value($utmContent),
    'GCLID: ' . display_value($gclid),
    'GBRAID: ' . display_value($gbraid),
    'WBRAID: ' . display_value($wbraid),
    '',
    'Privacy-akkoord: Ja',
    'Bron: ' . WEBSITE_URL . '/',
]);

$subject = 'Nieuwe websiteaanvraag: ' . $service;
if (!send_message(RECIPIENT, $subject, $mailBody, $email)) {
    error_log('Induclean contactformulier: verzenden naar de mailbox is mislukt.');
    redirect_to('/?form=error#contact');
}

$confirmationBody = implode("\r\n", [
    'Beste ' . $name . ',',
    '',
    'Bedankt voor uw aanvraag bij Induclean. Wij hebben uw bericht ontvangen en nemen contact met u op om de werkzaamheden en planning te bespreken.',
    '',
    'Uw gekozen dienst: ' . $service,
    '',
    'Met vriendelijke groet,',
    'Induclean',
    '+31 10 322 0272',
    'info@inducleanservices.nl',
]);

// De aanvraag is al veilig ontvangen; een mislukte bevestiging mag de bezoeker niet blokkeren.
send_message($email, 'Bevestiging van uw aanvraag bij Induclean', $confirmationBody, RECIPIENT);

redirect_to('/bedankt.html?status=success');
