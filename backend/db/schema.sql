-- Tabellen für PostgreTaskRepository/PostgreProjectRepository.
-- IDs sind die randomUUID()-Strings aus der Domain (Task/Project), daher TEXT statt UUID-Typ,
-- damit die Adapter sie weiterhin als reine Strings behandeln können.

CREATE TABLE IF NOT EXISTS project (
	id    TEXT PRIMARY KEY,
	name  TEXT NOT NULL,
	color TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS task (
	id          TEXT PRIMARY KEY,
	title       TEXT NOT NULL,
	description TEXT NOT NULL,
	project_id  TEXT NOT NULL REFERENCES project (id),
	date        TEXT,
	time        TEXT
);
