<?php
require_once 'config.php';
setCORSHeaders();
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

try {
    $pdo = getDBConnection();

    // Create tables if not exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS shipping_zones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        countries TEXT NOT NULL,
        enabled TINYINT(1) NOT NULL DEFAULT 1
    )");
    $pdo->exec("CREATE TABLE IF NOT EXISTS shipping_weight_ranges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        min_kg DECIMAL(5,3) NOT NULL,
        max_kg DECIMAL(5,3) NOT NULL,
        label VARCHAR(50) NOT NULL
    )");
    $pdo->exec("CREATE TABLE IF NOT EXISTS shipping_rates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        zone_id INT NOT NULL,
        range_id INT NOT NULL,
        price DECIMAL(8,2) NOT NULL DEFAULT 0,
        UNIQUE KEY zone_range (zone_id, range_id)
    )");

    // Safe migrations
    try { $pdo->exec("ALTER TABLE shipping_zones ADD COLUMN enabled TINYINT(1) NOT NULL DEFAULT 1"); } catch (Exception $e) {}
    try { $pdo->exec("ALTER TABLE products ADD COLUMN weight_kg DECIMAL(5,3) NOT NULL DEFAULT 0.500"); } catch (Exception $e) {}

    // Seed zones if empty
    if ($pdo->query("SELECT COUNT(*) FROM shipping_zones")->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO shipping_zones (name, countries, enabled) VALUES
            ('Schweiz', 'CH', 1),
            ('Europa', 'DE,FR,IT,AT,ES,NL,BE,PL,PT,CZ,DK,SE,FI,NO,HU,RO,HR,SK,SI,LU,LI', 1),
            ('International', '*', 1)");
    }

    // Seed ranges if empty
    if ($pdo->query("SELECT COUNT(*) FROM shipping_weight_ranges")->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO shipping_weight_ranges (min_kg, max_kg, label) VALUES
            (0, 0.5, '0–0.5 kg'),
            (0.5, 1, '0.5–1 kg'),
            (1, 3, '1–3 kg'),
            (3, 5, '3–5 kg'),
            (5, 10, '5–10 kg'),
            (10, 9999, '10+ kg')");
    }

    $zones = $pdo->query("SELECT id, name, countries, enabled FROM shipping_zones ORDER BY id")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($zones as &$z) { $z['id'] = intval($z['id']); $z['enabled'] = (bool)$z['enabled']; }

    $ranges = $pdo->query("SELECT id, min_kg, max_kg, label FROM shipping_weight_ranges ORDER BY min_kg")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($ranges as &$r) { $r['id'] = intval($r['id']); $r['min_kg'] = floatval($r['min_kg']); $r['max_kg'] = floatval($r['max_kg']); }

    $rates = $pdo->query("SELECT zone_id, range_id, price FROM shipping_rates")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rates as &$rt) { $rt['zone_id'] = intval($rt['zone_id']); $rt['range_id'] = intval($rt['range_id']); $rt['price'] = floatval($rt['price']); }

    echo json_encode(['success' => true, 'zones' => $zones, 'ranges' => $ranges, 'rates' => $rates]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
