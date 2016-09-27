CREATE DATABASE  IF NOT EXISTS `gapp` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `gapp`;

ALTER TABLE `gapp`.`player` 
ADD COLUMN `tos` TINYINT(1) NULL DEFAULT 0 AFTER `modifyDate`;

DROP TABLE IF EXISTS `wsstats`;
CREATE TABLE `wsstats` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `idPlayer` int(10) unsigned NOT NULL,
  `roundDuration` int(10) NOT NULL DEFAULT '0',
  `roundHigh` int(10) DEFAULT NULL,
  `roundAvg` decimal(6,1) DEFAULT NULL,
  `avgPtsPerWord` decimal(6,1) DEFAULT NULL,
  `avgWordCount` decimal(6,1) DEFAULT NULL,
  `longestWord` varchar(50) DEFAULT NULL,
  `totalRounds` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fkStats2Player_idx` (`idPlayer`),
  CONSTRAINT `fkStats2Player` FOREIGN KEY (`idPlayer`) REFERENCES `player` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=latin1;