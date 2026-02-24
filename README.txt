# Schedule I Pro - Ultimate Mixing Station

## 📦 Archivos incluidos

1. **01_index.html** - Estructura principal HTML
2. **02_recipes.js** - Base de datos con 20+ recetas verificadas
3. **03_app.js** - Lógica completa de la aplicación

## 🚀 Cómo unir los archivos

### Opción 1: Todo en un solo archivo (Recomendada)

1. Abre `01_index.html` en un editor de texto
2. Busca la línea que dice:
   ```html
   <!-- SCRIPTS - Pega aquí el contenido de recipes.js y app.js -->
   ```
3. Abre `02_recipes.js`, copia TODO el contenido y pégalo donde dice "Pega aquí el contenido de recipes.js"
4. Abre `03_app.js`, copia TODO el contenido y pégalo donde dice "Pega aquí el contenido de app.js"
5. Guarda el archivo como `schedule1-pro.html`
6. ¡Listo! Ábrelo en tu navegador

### Opción 2: Archivos separados (Para desarrollo)

1. Crea una carpeta llamada `schedule1-pro/`
2. Copia los 3 archivos dentro
3. En `01_index.html`, reemplaza las líneas de script al final por:
   ```html
   <script src="02_recipes.js"></script>
   <script src="03_app.js"></script>
   ```
4. Guarda `01_index.html` como `index.html`
5. Abre `index.html` en tu navegador

## ✨ Características

### Dashboard
- Estadísticas en tiempo real
- Gráfico de rentabilidad por tipo de droga
- Accesos rápidos a categorías

### Recetas (20+ verificadas)
- Filtros por: Early/Mid/Late game, tipo de droga, rango
- Buscador en tiempo real (nombre, ingrediente, efecto)
- Sistema de favoritos (guarda en localStorage)
- Copiar receta al portapapeles
- Indicador de rango requerido
- Ganancia neta destacada por colores

### Calculadora
- Selección de base (6 tipos)
- 16 ingredientes disponibles
- Simulación paso a paso
- Cálculo automático de costo/venta/ganancia
- Máximo 8 ingredientes
- Eliminar ingredientes individualmente

### Optimizador Inteligente
- Ingresa tu presupuesto
- Te recomienda la mejor receta posible
- Muestra ROI (retorno de inversión)
- Alternativas con buen retorno

## 🎨 Mejoras visuales (200%)

- **Glassmorphism** en todas las tarjetas
- **Gradientes animados** en textos importantes
- **Hover effects** con escala y sombras
- **Scrollbars personalizadas**
- **Responsive** para móvil
- **Iconos FontAwesome** en toda la interfaz
- **Transiciones suaves** entre secciones
- **Colores por categoría**:
  - 🟢 Early Game = Verde
  - 🔵 Mid Game = Azul
  - 🟣 Late Game = Púrpura

## 📊 Recetas incluidas

| Categoría | Cantidad | Mejor Ganancia |
|-----------|----------|----------------|
| Early (Hoodlum) | 10 recetas | $109 (OG Kush Sweet) |
| Mid (Peddler) | 5 recetas | $112 (OG Kush Mejorado) |
| Late (Hustler) | 5 recetas | $565 (Cocaine MEGA) |

**Total: 20 recetas verificadas**

## 🔧 Personalización

### Agregar más recetas

1. Abre `02_recipes.js`
2. Copia cualquier objeto receta como template
3. Modifica los valores según tu receta
4. Asegúrate de darle un ID único

Template:
```javascript
{
    id: 21, // ID único
    name: "Nombre de tu receta",
    category: "early|mid|late",
    type: "weed|meth|cocaine|shrooms",
    base: "OG Kush",
    baseIcon: "🌿",
    rank: "Hoodlum I",
    ingredients: [
        {icon: "🌿", name: "OG Kush", price: 30},
        {icon: "🍌", name: "Banana", price: 2}
    ],
    effects: ["Energizing", "Gingeritis"],
    cost: 32,
    sellPrice: 65,
    profit: 33,
    addiction: 50,
    difficulty: "Fácil"
}
```

## 💾 Datos guardados

La aplicación guarda automáticamente en tu navegador:
- **Favoritos**: Recetas marcadas con ⭐

Para borrar los datos: Developer Tools > Application > Local Storage > Delete All

## ⌨️ Atajos de teclado

- `Ctrl + E` : Exportar datos a consola (debug)

## 🌐 Compatibilidad

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Responsive

- Desktop: Grid de 2 columnas
- Tablet: Grid de 1-2 columnas
- Móvil: 1 columna, navegación compacta

## 📝 Notas

- Todas las recetas han sido verificadas por la comunidad
- Fuentes: PCGamesN, IGN, Shacknews, GameRant
- Multiplicadores de efectos son aproximados
- Los precios pueden variar ligeramente según la versión del juego

## 🐛 Solución de problemas

**La página no carga:**
- Verifica que los archivos JS estén correctamente vinculados
- Abre la consola del navegador (F12) para ver errores

**Las recetas no aparecen:**
- Asegúrate de que `recipes` esté definido en `02_recipes.js`
- Verifica que no haya errores de sintaxis (comas faltantes)

**Los gráficos no funcionan:**
- Requiere conexión a internet (carga Chart.js desde CDN)
- Alternativa: Descarga Chart.js y vincúlalo localmente

## 🎯 Próximas mejoras sugeridas

- [ ] Comparador de recetas lado a lado
- [ ] Modo oscuro/claro toggle
- [ ] Importar/Exportar datos JSON
- [ ] Checklist de progreso por rangos
- [ ] Calculadora de rutas óptimas
- [ ] Precios de dealers actualizados

---

**Versión:** 3.0 Pro  
**Autor:** Community Edition  
**Licencia:** Libre uso para la comunidad de Schedule I