//Asociaciones

import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Categoria from "./Categoria.js";
import Usuario from "./Usuario.js";

/*
belongsTo 1:1 (este se lee mejor de izquierda a derecha)
hasOne 1:1 
*/

Propiedad.belongsTo(Precio, {foreignKey: 'precioId'});
Propiedad.belongsTo(Categoria, {foreignKey: 'categoriaId'});
Propiedad.belongsTo(Usuario, {foreignKey: 'usuarioId'});
export{
    Propiedad,
    Precio,
    Categoria,
    Usuario
}