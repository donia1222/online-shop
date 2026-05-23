-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql24j11.db.hostpoint.internal
-- Erstellungszeit: 22. Mai 2026 um 22:32
-- Server-Version: 10.11.16-MariaDB-log
-- PHP-Version: 8.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `owoxogis_shoptemplatte`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `slug` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `categories`
--

INSERT INTO `categories` (`id`, `parent_id`, `slug`, `name`, `description`, `created_at`) VALUES
(129, NULL, 'armbrust', 'Armbrust', NULL, '2026-04-30 15:16:39'),
(130, NULL, 'armbrust-zubehoer', 'Armbrust und Bogen Zubehör', '', '2026-04-30 15:17:56'),
(131, NULL, 'messer', 'Messer', NULL, '2026-04-30 15:18:29'),
(132, NULL, 'lampen', 'Lampen', NULL, '2026-04-30 15:18:58'),
(133, NULL, 'rauch-grill', 'Rauch und Grill', '', '2026-04-30 15:19:15'),
(134, NULL, 'beil', 'Beil', NULL, '2026-04-30 15:19:32'),
(135, NULL, 'pfeilbogen', 'Pfeilbogen', NULL, '2026-04-30 15:19:51'),
(136, NULL, 'schleuder-blasrohr', 'Schleuder und Blasrohr', '', '2026-04-30 15:20:09'),
(137, NULL, 'security', 'Schutzkleidung und Basebalschläger', '', '2026-04-30 15:20:30'),
(147, 131, 'feste-klinge', 'Feste Klinge', '', '2026-05-05 08:15:45'),
(148, 131, 'klappmesser', 'Klappmesser', '', '2026-05-05 08:22:38'),
(149, 131, 'messer-zubeh-r', 'Messer und Outdoor Zubehör', '', '2026-05-05 08:22:58'),
(150, 129, 'compound-armbrust', 'Compound Armbrust', '', '2026-05-05 09:12:40'),
(151, 129, 'recurve-armbrust', 'Recurve Armbrust', '', '2026-05-05 09:12:59'),
(152, 129, 'magazin-armbrust', 'Magazin Armbrust', '', '2026-05-05 09:13:15'),
(153, 130, 'zielvorrichtungen', 'Zielvorrichtungen und Infrarotgeräte', '', '2026-05-05 09:54:37'),
(154, 130, 'taschen', 'Taschen', '', '2026-05-05 09:56:58'),
(155, 130, 'ziele', 'Ziele und Pfeilfangnetze', '', '2026-05-05 09:58:53'),
(156, 130, 'armbrustpfeile-und-bolzen', 'Armbrustpfeile und Bolzen', '', '2026-05-05 10:01:50'),
(157, 130, 'pfeilbogen-pfeile', 'Pfeilbogen Pfeile und Sehnen', '', '2026-05-05 14:54:05'),
(158, 130, 'pfeilspitzen', 'Pfeilspitzen', '', '2026-05-05 14:55:52'),
(159, 132, 'stirnlampen', 'Stirnlampen', '', '2026-05-05 14:58:56'),
(160, 132, 'waffenlampen', 'Waffenlampen', '', '2026-05-05 14:59:23'),
(161, 132, 'handlampen', 'Handlampen', '', '2026-05-05 14:59:40'),
(162, 132, 'ladeger-te', 'Ladegeräte', '', '2026-05-05 15:03:56'),
(163, 136, 'schleuder-und-zubeh-r', 'Schleuder und Zubehör', '', '2026-05-05 15:08:39'),
(164, 136, 'blasrohr-und-zubeh-r', 'Blasrohr und Zubehör', '', '2026-05-05 15:08:56'),
(165, 137, 'basebalschl-ger', 'Basebalschläger', '', '2026-05-05 15:14:08'),
(166, 137, 'schutzkleidung', 'Schutzkleidung', '', '2026-05-05 15:17:08'),
(167, 135, 'recurve-bogen', 'Recurve Bogen', '', '2026-05-05 16:01:39'),
(168, 135, 'compound-bogen', 'Compound Bogen', '', '2026-05-05 16:02:05');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_category_parent` (`parent_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=169;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `fk_category_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
