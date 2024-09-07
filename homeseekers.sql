/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `mensajes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mensaje` varchar(200) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `propiedadId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `usuarioId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `propiedadId` (`propiedadId`),
  KEY `usuarioId` (`usuarioId`),
  CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`propiedadId`) REFERENCES `propiedades` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `precios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `propiedades` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `habitaciones` int NOT NULL,
  `estacionamiento` int NOT NULL,
  `wc` int NOT NULL,
  `calle` varchar(60) NOT NULL,
  `lat` varchar(255) NOT NULL,
  `lng` varchar(255) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `publicado` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `precioId` int DEFAULT NULL,
  `categoriaId` int DEFAULT NULL,
  `usuarioId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `precioId` (`precioId`),
  KEY `categoriaId` (`categoriaId`),
  KEY `usuarioId` (`usuarioId`),
  CONSTRAINT `propiedades_ibfk_1` FOREIGN KEY (`precioId`) REFERENCES `precios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `propiedades_ibfk_2` FOREIGN KEY (`categoriaId`) REFERENCES `categorias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `propiedades_ibfk_3` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `confirmado` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `categorias` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(1, 'Casa', '2024-08-22 23:03:14', '2024-08-22 23:03:14');
INSERT INTO `categorias` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(2, 'Departamento', '2024-08-22 23:03:14', '2024-08-22 23:03:14');
INSERT INTO `categorias` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(3, 'Bodega', '2024-08-22 23:03:14', '2024-08-22 23:03:14');
INSERT INTO `categorias` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(4, 'Terreno', '2024-08-22 23:03:14', '2024-08-22 23:03:14'),
(5, 'Cabaña', '2024-08-22 23:03:14', '2024-08-22 23:03:14');

INSERT INTO `mensajes` (`id`, `mensaje`, `createdAt`, `updatedAt`, `propiedadId`, `usuarioId`) VALUES
(1, 'Hola me interesa la propiedad! Te dejo mi numero: 5520239132', '2024-09-07 02:05:48', '2024-09-07 02:05:48', NULL, 2);
INSERT INTO `mensajes` (`id`, `mensaje`, `createdAt`, `updatedAt`, `propiedadId`, `usuarioId`) VALUES
(2, 'Hola me interesa la propiedad! Te dejo mi numero: 5520239132', '2024-09-07 02:06:04', '2024-09-07 02:06:04', NULL, 2);
INSERT INTO `mensajes` (`id`, `mensaje`, `createdAt`, `updatedAt`, `propiedadId`, `usuarioId`) VALUES
(3, 'Hola me interesa la propiedad! Te dejo mi numero: 5520239132', '2024-09-07 02:06:29', '2024-09-07 02:06:29', NULL, 2);
INSERT INTO `mensajes` (`id`, `mensaje`, `createdAt`, `updatedAt`, `propiedadId`, `usuarioId`) VALUES
(4, 'Hola me interesa la propiedad! Te dejo mi numero: 5520239132', '2024-09-07 02:06:35', '2024-09-07 02:06:35', NULL, 2),
(5, 'Hola me interesa la propiedad! Te dejo mi numero: 5520239132', '2024-09-07 02:15:00', '2024-09-07 02:15:00', NULL, 2),
(6, 'Hola! Me gustaría conocer más la propiedad :)', '2024-09-07 06:40:19', '2024-09-07 06:40:19', 'a9afd5a6-b60a-4cb0-8a34-fd6880659ebf', 2);

INSERT INTO `precios` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(1, '0 - $10,000 USD', '2024-08-22 23:03:14', '2024-08-22 23:03:14');
INSERT INTO `precios` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(2, '$10,000 - $30,000 USD', '2024-08-22 23:03:14', '2024-08-22 23:03:14');
INSERT INTO `precios` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(3, '$30,000 - $50,000 USD', '2024-08-22 23:03:14', '2024-08-22 23:03:14');
INSERT INTO `precios` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(4, '$50,000 - $75,000 USD', '2024-08-22 23:03:14', '2024-08-22 23:03:14'),
(5, '$75,000 - $100,000 USD', '2024-08-22 23:03:14', '2024-08-22 23:03:14'),
(6, '$100,000 - $150,000 USD', '2024-08-22 23:03:14', '2024-08-22 23:03:14'),
(7, '$150,000 - $200,000 USD', '2024-08-22 23:03:14', '2024-08-22 23:03:14'),
(8, '$200,000 - $300,000 USD', '2024-08-22 23:03:14', '2024-08-22 23:03:14'),
(9, '$300,000 - $500,000 USD', '2024-08-22 23:03:14', '2024-08-22 23:03:14'),
(10, '+ $500,000 USD', '2024-08-22 23:03:14', '2024-08-22 23:03:14');

INSERT INTO `propiedades` (`id`, `titulo`, `descripcion`, `habitaciones`, `estacionamiento`, `wc`, `calle`, `lat`, `lng`, `imagen`, `publicado`, `createdAt`, `updatedAt`, `precioId`, `categoriaId`, `usuarioId`) VALUES
('0b277ea6-d4f1-4491-8f10-27b64577b6ed', 'Bonita casa en Interlomas', 'Residencia de lujo con 5 recámaras, jardín privado, piscina y vigilancia 24/7. Ubicada en una de las colonias más exclusivas de la ciudad.', 5, 2, 8, 'Calle Fuente De Olivos 20', '19.394092242883', '-99.272496020083', '59cn37djuco1i75krik3.jpg', 1, '2024-09-07 07:05:45', '2024-09-07 07:05:58', 10, 1, 1);
INSERT INTO `propiedades` (`id`, `titulo`, `descripcion`, `habitaciones`, `estacionamiento`, `wc`, `calle`, `lat`, `lng`, `imagen`, `publicado`, `createdAt`, `updatedAt`, `precioId`, `categoriaId`, `usuarioId`) VALUES
('157f5f4a-b755-4361-91a7-76d4c4a5fada', 'Terreno en San Miguel de Allende', 'Terreno de 500m² en zona tranquila, ideal para construir casa de campo. A 10 minutos del centro histórico.', 0, 0, 0, 'Privada Los Ramírez', '20.898201088839', '-100.7486096028', '7627our5pp1i75k4cli.jpg', 1, '2024-09-07 06:52:16', '2024-09-07 06:53:18', 5, 4, 1);
INSERT INTO `propiedades` (`id`, `titulo`, `descripcion`, `habitaciones`, `estacionamiento`, `wc`, `calle`, `lat`, `lng`, `imagen`, `publicado`, `createdAt`, `updatedAt`, `precioId`, `categoriaId`, `usuarioId`) VALUES
('2bd9e7d1-3cb5-417d-84f1-b390041b1b3d', 'Penthouse en Monterrey', 'Exclusivo penthouse con 3 recámaras, terraza panorámica, seguridad 24/7 y acceso a gimnasio y áreas recreativas.', 2, 1, 3, 'Calle Cerezo 2609', '25.69729080689', '-100.283355638517', 'clfifoidgko1i75kg4lh.jpg', 1, '2024-09-07 06:59:38', '2024-09-07 06:59:43', 6, 2, 1);
INSERT INTO `propiedades` (`id`, `titulo`, `descripcion`, `habitaciones`, `estacionamiento`, `wc`, `calle`, `lat`, `lng`, `imagen`, `publicado`, `createdAt`, `updatedAt`, `precioId`, `categoriaId`, `usuarioId`) VALUES
('2f0b0373-a7fe-4fd0-822f-610332aa6c53', 'Casa campestre en Querétaro', ' Propiedad de 2,000m² con casa de 3 recámaras, piscina y vistas al campo. Ideal para quienes buscan tranquilidad.', 3, 1, 4, 'Calle 33 701', '20.5688249', '-100.3942356', 'g14r3b3fpko1i75kdutm.jpg', 1, '2024-09-07 06:58:27', '2024-09-07 06:58:32', 6, 1, 1),
('367ed069-423a-40c4-8685-93a9556b4066', 'Departamento en La Roma', 'Departamento de 2 recámaras, sala de TV y cocina integral. Ubicado en una zona familiar y con cercanía a centros comerciales y escuelas.', 2, 1, 3, 'Calle Zacatecas 55', '19.416533', '-99.1568781', 'd1fps331bmg1i75klora.jpg', 1, '2024-09-07 07:02:41', '2024-09-07 07:02:48', 10, 2, 1),
('959c3bf2-79ea-414a-ac30-aefa198aba68', 'Departamento en Condesa', 'Moderno departamento de 1 recámara, cocina equipada y terraza privada. Perfecto para quienes buscan vivir en una zona bohemia y llena de vida nocturna.', 1, 1, 2, 'Calle Antonio Sola 16B', '19.414441073041', '-99.17280283718', 'krls4egj2ng1i75kimdi.jpg', 1, '2024-09-07 07:01:01', '2024-09-07 07:01:07', 9, 2, 1),
('98f152d6-52ae-4f9b-942a-e4ab5a4d5a45', 'Departamento en Polanco, CDMX', 'Elegante departamento de lujo, 2 recámaras, cocina equipada, seguridad 24/7 y áreas comunes exclusivas. Ubicado en una de las zonas más prestigiosas de la ciudad.', 2, 1, 2, 'Calle Galileo 81', '19.431930710297', '-99.192623858895', 'dvjg4vvvqg1i75jkoip.jpg', 1, '2024-09-07 06:44:40', '2024-09-07 06:44:46', 6, 2, 1),
('a65e159b-757f-4120-9783-52ea8c78dd07', 'Casa moderna en Cancún', 'Hermosa casa con diseño contemporáneo, 3 recámaras, piscina y amplio jardín. A pocos minutos de la playa y centros comerciales.', 5, 2, 7, 'Calle 27 255', '21.183009902566', '-86.824299351696', '1a5751llgv1i75jism5.jpg', 1, '2024-09-07 06:43:37', '2024-09-07 06:43:45', 10, 1, 1),
('a9afd5a6-b60a-4cb0-8a34-fd6880659ebf', 'Casa moderna en la playa', '¿Te imaginas despertar todos los días con la brisa del mar y el sonido de las olas? Esta espectacular casa en la playa es el refugio perfecto para quienes buscan tranquilidad, lujo y contacto directo con la naturaleza.', 3, 1, 4, 'Avenida Baja California', '16.8711179', '-99.8939347', 'q4futas7gh81i75h0tkj.jpg', 1, '2024-09-07 05:58:19', '2024-09-07 06:30:46', 8, 1, 1),
('c4cef419-3c34-4096-b3b8-479e53d3331a', 'Casa en Guadalajara', 'Casa amplia en zona residencial, 4 recámaras, jardín grande y estacionamiento para 3 autos. Perfecta para familias.', 4, 1, 3, 'Calle Colonos 190', '20.608474277243', '-103.309786200202', '5cbti0i4g41i75kai1f.jpg', 1, '2024-09-07 06:56:33', '2024-09-07 06:56:41', 6, 1, 1),
('f70e2fe5-62bf-4785-8c5e-9317362dccc3', 'Gran casa con piscina', 'Casa con diseño clásico, 3 recámaras, amplio jardín y cochera para 2 autos. En una zona tranquila y con fácil acceso a vías rápidas.', 3, 1, 4, 'Avenida Doctor José María Vertiz 894', '19.3889', '-99.1513', 'pcj9cp2t4c1i75kns07.jpg', 1, '2024-09-07 07:03:51', '2024-09-07 07:03:57', 9, 1, 1);

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `token`, `confirmado`, `createdAt`, `updatedAt`) VALUES
(1, 'Daniel', 'danielvegaam@gmail.com', '$2b$10$UR5XUojjKRZzfPCEgBynsuxM9aGKxw4WGmVmbj0G9tGxhMa3T8AKG', 'obino5t8dvg1i76n3srm', 1, '2024-08-22 23:03:14', '2024-09-07 17:04:42');
INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `token`, `confirmado`, `createdAt`, `updatedAt`) VALUES
(2, 'Comprador', 'danygamer17@hotmail.com', '$2b$10$7DMLYkmg9o2X9HABeE.LIuVGPsOGqMM2vVnSyFB0xQx95O/3iCfsG', NULL, 1, '2024-09-05 02:42:54', '2024-09-05 02:43:43');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;