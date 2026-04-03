<?php
require_once 'config.php';
require_once 'gift_card_functions.php';

/**
 * Procesa los items de gutschein de un pedido recién creado.
 * Se llama desde add_order.php después del commit.
 *
 * @param PDO    $pdo
 * @param int    $orderId
 * @param array  $giftCardItems   [ ['gift_card_id' => X, 'price' => Y], ... ]
 * @param string $buyerName
 * @param string $buyerEmail
 * @param bool   $isPaidNow       true = PayPal/Stripe (generar código ya)
 *                                false = Factura (código se genera cuando el admin marca pagado)
 */
function processGiftCardOrder(
    PDO    $pdo,
    int    $orderId,
    array  $giftCardItems,
    string $buyerName,
    string $buyerEmail,
    bool   $isPaidNow
): void {
    $date = date('d.m.Y');

    // Obtener order_number — es el código visible del gutschein
    $stmtOrd = $pdo->prepare("SELECT order_number FROM orders WHERE id = :id");
    $stmtOrd->execute([':id' => $orderId]);
    $orderNumber = (string)($stmtOrd->fetchColumn() ?: $orderId);

    foreach ($giftCardItems as $item) {
        $giftCardId = intval($item['gift_card_id']);
        $amount     = floatval($item['price']);
        $status     = $isPaidNow ? 'aktiv' : 'offen';

        // El código = order_number desde el primer momento
        $stmt = $pdo->prepare(
            "INSERT INTO gift_card_purchases
                (order_id, gift_card_id, buyer_name, buyer_email, amount, code, status, paid_at)
             VALUES
                (:order_id, :gc_id, :buyer_name, :buyer_email, :amount, :code, :status,
                 " . ($isPaidNow ? "NOW()" : "NULL") . ")"
        );
        $stmt->execute([
            ':order_id'    => $orderId,
            ':gc_id'       => $giftCardId,
            ':buyer_name'  => $buyerName,
            ':buyer_email' => $buyerEmail,
            ':amount'      => $amount,
            ':code'        => $orderNumber,
            ':status'      => $status,
        ]);

        if ($isPaidNow) {
            if (!empty($buyerEmail)) {
                sendGiftCardEmail($buyerEmail, $buyerName, $orderNumber, $amount, $date);
            }
            sendGiftCardSellerNotification($orderNumber, $amount, $buyerName, $buyerEmail, $date, true);
        } else {
            if (!empty($buyerEmail)) {
                sendGiftCardPendingEmail($buyerEmail, $buyerName, $amount, $orderNumber);
            }
            sendGiftCardSellerNotification($orderNumber, $amount, $buyerName, $buyerEmail, $date, false);
        }
    }
}

/**
 * Email al comprador cuando el pago es por factura (sin código todavía)
 */
function sendGiftCardPendingEmail(string $buyerEmail, string $buyerName, float $amount, string $orderNumber = ''): bool {
    $subject = "Bestellbestaetigung – Geschenkgutschein CHF " . number_format($amount, 2, '.', "'");

    $htmlBody = '
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#141414;color:#fff;border-radius:8px;overflow:hidden;">
      <div style="background:#0d0d0d;padding:20px 30px;text-align:center;border-bottom:2px solid #b40000;">
        <h1 style="color:#fff;font-size:20px;margin:0;letter-spacing:2px;">BESTELLBESTAETIGUNG</h1>
        <p style="color:#aaa;font-size:11px;margin:4px 0 0;">US-Fishing &amp; Huntingshop</p>
      </div>
      <div style="padding:30px;">
        <p style="color:#ccc;">Guten Tag, <strong style="color:#fff;">' . htmlspecialchars($buyerName) . '</strong></p>
        <p style="color:#ccc;">Vielen Dank fuer Ihre Bestellung! Wir haben Ihre Bestellung erhalten.</p>

        <div style="background:#1e1e1e;border:2px solid #ff3232;border-radius:8px;padding:20px;text-align:center;margin:20px 0;">
          <p style="color:#aaa;font-size:11px;margin:0 0 6px;letter-spacing:1px;">GUTSCHEIN CODE</p>
          <p style="color:#ff3232;font-size:28px;font-weight:bold;letter-spacing:4px;margin:0;">' . htmlspecialchars($orderNumber) . '</p>
          <p style="color:#fff;font-size:22px;font-weight:bold;margin:10px 0 0;">CHF ' . number_format($amount, 2, '.', "'") . '</p>
        </div>

        <p style="color:#ccc;font-size:13px;">Gutschein Code: <strong style="color:#ff3232;">' . htmlspecialchars($orderNumber) . '</strong></p>
        <p style="color:#f59e0b;font-size:20px;font-weight:bold;margin:16px 0 0;">&#9679; Code inaktiv – wird nach Zahlungseingang aktiviert</p>

        <div style="background:#1a1200;border:1px solid #f59e0b;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="color:#fbbf24;font-size:13px;margin:0;">
            <strong>Hinweis:</strong> Nach Eingang Ihrer Zahlung erhalten Sie eine Bestaetigung und der Code wird aktiviert.
          </p>
        </div>

        <p style="color:#999;font-size:12px;">Bei Fragen: <a href="mailto:urs.schwendener@usfh.ch" style="color:#b40000;">urs.schwendener@usfh.ch</a></p>

        <hr style="border:none;border-top:1px solid #333;margin:20px 0;">
        <p style="color:#666;font-size:10px;text-align:center;">
          Urs Schwendener &nbsp;**&nbsp; Bahnhofstrasse 2 &nbsp;**&nbsp; CH 9475 Sevelen<br>
          0786066105 &nbsp;**&nbsp; www.usfh.ch
        </p>
      </div>
    </div>';

    $headers  = "From: US-Fishing & Huntingshop <noreply@usfh.ch>\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    return mail($buyerEmail, $subject, $htmlBody, $headers);
}
?>
