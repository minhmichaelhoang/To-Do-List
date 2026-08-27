/**
 * Wire-Format für ein Projekt über die REST-API. Wird eingebettet in
 * `TaskDto.project` zurückgegeben, damit das Frontend Name und Farbe eines
 * Tasks anzeigen kann, ohne einen zweiten Request zu brauchen.
 */
export interface ProjectDto {
	id: string;
	name: string;
	color: string;
}
