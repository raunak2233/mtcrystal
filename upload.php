<?php
declare(strict_types=1);

header('Content-Type: application/json');

$config = [
    'upload_dir' => __DIR__ . '/uploads',
    'public_base_url' => 'https://imager.assignease.io/uploads',
    'auth_token' => 'replace-with-strong-random-token',
    'field_name' => 'images',
    'max_file_size' => 5 * 1024 * 1024,
    'allowed_extensions' => ['jpg', 'jpeg', 'png', 'webp', 'gif'],
];

function respond(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function getAuthorizationHeader(): string
{
    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        return trim((string) $_SERVER['HTTP_AUTHORIZATION']);
    }

    if (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        return trim((string) $_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
    }

    return '';
}

function normalizeFilesArray(array $fileInput): array
{
    $normalized = [];

    if (!isset($fileInput['name'])) {
        return $normalized;
    }

    if (is_array($fileInput['name'])) {
        $count = count($fileInput['name']);
        for ($index = 0; $index < $count; $index++) {
            $normalized[] = [
                'name' => $fileInput['name'][$index] ?? '',
                'type' => $fileInput['type'][$index] ?? '',
                'tmp_name' => $fileInput['tmp_name'][$index] ?? '',
                'error' => $fileInput['error'][$index] ?? UPLOAD_ERR_NO_FILE,
                'size' => $fileInput['size'][$index] ?? 0,
            ];
        }
    } else {
        $normalized[] = $fileInput;
    }

    return $normalized;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['error' => 'Method not allowed']);
}

$authHeader = getAuthorizationHeader();
$expectedHeader = 'Bearer ' . $config['auth_token'];
if ($config['auth_token'] !== '' && $authHeader !== $expectedHeader) {
    respond(401, ['error' => 'Unauthorized']);
}

$fieldName = (string) $config['field_name'];
if (empty($_FILES[$fieldName])) {
    respond(400, ['error' => 'No images uploaded']);
}

if (!is_dir($config['upload_dir']) && !mkdir($config['upload_dir'], 0755, true) && !is_dir($config['upload_dir'])) {
    respond(500, ['error' => 'Failed to create upload directory']);
}

$files = normalizeFilesArray($_FILES[$fieldName]);
$imageUrls = [];

foreach ($files as $file) {
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        respond(400, ['error' => 'One of the files failed to upload']);
    }

    $originalName = (string) ($file['name'] ?? '');
    $size = (int) ($file['size'] ?? 0);
    $tmpName = (string) ($file['tmp_name'] ?? '');

    if ($size <= 0 || $size > (int) $config['max_file_size']) {
        respond(400, ['error' => 'Each image must be 5 MB or smaller']);
    }

    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    if (!in_array($extension, $config['allowed_extensions'], true)) {
        respond(400, ['error' => 'Allowed formats: JPG, PNG, WEBP, GIF']);
    }

    $safeBaseName = preg_replace('/[^a-z0-9.-]+/i', '-', pathinfo($originalName, PATHINFO_FILENAME));
    $safeBaseName = trim((string) $safeBaseName, '-');
    if ($safeBaseName === '') {
        $safeBaseName = 'image';
    }

    $targetFilename = sprintf(
        '%s-%s-%d.%s',
        strtolower($safeBaseName),
        date('YmdHis'),
        random_int(100, 999),
        $extension
    );

    $targetPath = rtrim((string) $config['upload_dir'], DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $targetFilename;
    if (!move_uploaded_file($tmpName, $targetPath)) {
        respond(500, ['error' => 'Failed to store uploaded image']);
    }

    $imageUrls[] = rtrim((string) $config['public_base_url'], '/') . '/' . rawurlencode($targetFilename);
}

respond(200, ['imageUrls' => $imageUrls]);
