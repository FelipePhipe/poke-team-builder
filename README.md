# PokéTeam Builder & Analyzer (Angular + PokéAPI)

## Propósito de la Aplicación
Aplicación web interactiva desarrollada con **Angular** que permite a los usuarios buscar información detallada de cualquier Pokémon, inspeccionar el efecto real de sus habilidades, calcular sus multiplicadores defensivos (debilidades, resistencias e inmunidades) y conformar un equipo de hasta 6 Pokémon con análisis global de vulnerabilidades elementales.

## Principales Funcionalidades
- **Buscador de Pokémon en tiempo real:** Consulta por nombre o número de Pokédex nacional, con manejo de estados de carga, validación de entradas vacías y mensajes de error ante búsquedas inexistentes.
- **Inspector interactivo de habilidades:** Permite seleccionar cualquiera de las habilidades disponibles del Pokémon (incluyendo habilidades ocultas) para consultar su descripción oficial.
- **Calculadora de relaciones de tipo:** Combina los tipos del Pokémon para calcular multiplicadores reales de daño recibido ($4\times$, $2\times$, $0.5\times$, $0.25\times$ y $0\times$).
- **Constructor y analizador de equipos (hasta 6 miembros):** Permite agregar y eliminar integrantes del equipo y genera alertas automáticas sobre qué tipos elementales amenazan a más miembros del grupo.

## Endpoints de PokéAPI Utilizados
La aplicación integra tres recursos distintos de **PokéAPI v2** (`https://pokeapi.co/api/v2`):
1. **`GET /pokemon/{nombre_o_id}`**: Obtiene la información base del Pokémon, su arte oficial (`official-artwork`), estadísticas base (`stats`), lista de tipos (`types`) y lista de habilidades (`abilities`).
2. **`GET /type/{nombre_tipo}`**: Obtiene las relaciones de daño (`damage_relations`: `double_damage_from`, `half_damage_from`, `no_damage_from`) para calcular las debilidades individuales y grupales del equipo.
3. **`GET /ability/{nombre_habilidad}`**: Obtiene los textos descriptivos (`flavor_text_entries`) para mostrar el efecto detallado de cada habilidad seleccionada por el usuario.

## Instalación y Ejecución Local
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/felipephipe/poke-team-builder.git (https://github.com/TU-USUARIO/poke-team-builder.git)