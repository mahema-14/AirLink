-- =========================================================
-- AIRLINK - 01: CREATE DATABASE
-- MySQL 8.0.16+
-- Run this file first.
-- =========================================================

CREATE DATABASE IF NOT EXISTS airlink
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE airlink;

SELECT DATABASE() AS current_database;