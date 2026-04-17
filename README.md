## Descripción

**SpaceDefense / UFODefenseAng** es un mini-juego arcade web construido con Angular, donde debes defender el planeta derribando UFOs antes de que termine el tiempo.

### ¿Qué hace el jugador?
- Controla un misil en la parte inferior del escenario.
- Ajusta dificultad antes de jugar:
  - Número de UFOs simultáneos (1 a 5).
  - Duración de partida (60/120/180 segundos).
- Intenta maximizar la puntuación:
  - +100 por impacto.
  - -25 por disparo fallido.
- Al terminar, puede guardar su récord (requiere login).

### Controles
- `←` mover misil a la izquierda
- `→` mover misil a la derecha
- `Espacio` disparar
- `Esc` pausar/reanudar

### Loop de juego (resumen)
- Movimiento continuo de UFOs y misil con temporizadores.
- Detección de colisiones misil/UFO.
- Cuenta atrás de tiempo y cierre automático al llegar a 0.
- Cálculo final de score normalizado por tiempo y dificultad (nº de UFOs).

---

## Tecnologías

- **Angular 21** (`@angular/core`, `@angular/router`, `@angular/forms`, `@angular/common/http`)
- **Angular CLI 21**
- **TypeScript ~5.9**
- **RxJS** para estado de autenticación y polling de rankings.
- **Bootstrap 5 + Popper + Bootstrap Icons** para UI.
- Arquitectura basada en **Standalone Components** (sin `NgModule` raíz).

---

## Cómo jugar / probar

### Requisitos
- Node.js
- npm ( `npm@11.4.1`).

### Instalación
```bash
npm install
```
## Ejecutar en local

Para iniciar un servidor de desarrollo local, ejecute:

```bash
npm start
```
o
```bash
ng serve
```
Abrir en `http://localhost:4200/`.

---
### Build

```bash
npm run build
```

---
### Tests

```bash
npm test
```

El repositorio incluye tests unitarios (`*.spec.ts`).


