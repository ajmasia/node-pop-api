# NodePop work notes

## Notas generales

Esta app esta construida con Node.js y el framework Express.js

El controlador prinicpal de la app es el fichero `bin/www`. Es el que se encarga de configurar toda la app, el servidor y también ponerlo en marcha según las parámetros de configuración que se hayan definido en el arranque. En este fichero es donde se debe requerir la librería `dotenv` para la configuración externa de variables de entorno dentro del fichero `.env`.

En la primera fase del proyecto he usado una arquitectura de enrutamiento mediante routers de express. Este tipo de arquitectura resulta bastante sencilla aunque según nos ha comentado Javier, dificulta el trabajo posterior con los TDD. 

Puede verse la esta estructura con el controlador `ads.js` de la carpeta `routes/apiv1`.

Esta opción de desarrollo implica definir todos los middlewares correspondinetes a una ruta dentro de un mismo fichero usando la propuedad `router` de Express, definiendo dicha ruta en controlador principal de nuestra aplicación `app.js`

```js
router.get('/', async (req, res, next) => {
    try {
        // Your code
    } catch(err) {
        // Your code if ocurre an error
    }
}
```

```js
app.use('/apiv1/ads', require('./routes/apiv1/ads'));
```
La otra arquitectura es usar controladores de enrutamiento. He usado esta opción para desarrollar todas las peticiones de usuarios y la autentificación. Consiste sencillamente en definir una clase `userController.js` a la que se le definen tantos métodos como middlewares se necesiten:

```js
    class UserController {
        async method (req, res, next) {
            try {
        // Your code
        } catch(err) {
            // Your code if ocurre an error
        }
        }
    }

    module.exports = new UserController();
```

De nuevo en el controlador princiapl cargamos la ruta, pero en este caso apuntando al controlador que se ha definido:

```js
app.get('/apiv1/users', usersController.usersList);
````

Como se puede ver con este tipo de arquitectura hay que asignar el tipo de petición concreto al método del controlador `get` -> `usercontroller.userList` 

## Middlewares

Las funciones de middleware son funciones que tiene acceso a los objetos de petición (req), respuesta (res) y a la sisguiente middleware, dentro del ciclo de funcionamiento de la app. Esto quiere decir que la ejecución es secuencial y se ha de controlar el paso de un middleware a otro mediante la función next().

## Autentificación mediante JWT

Para trabajar con este método de autentificación se precisa del uso de la librería `jsonwebtoken`. 

Este método consiste en los siguiente:
- Resolver la petición de login verificando que el usuario y el password facilitado son correctos dentro de la base de datos
- En el caso de que no sean correctos se informa al cliente
- En el caso de que sean correctos los datos, se genera un token usando la librería `jsonwebtoken`:

```js
const payload = {
    sub: existingUser._id,
    iat: moment().unix(),
    exp: moment().add(process.env.JWT_EXP_TIME, process.env.JWT_EXP_UNIT).unix()
    }
            
jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
    if (err) {
        return next(err);
    }
    res.json({
        success: true,
        result: `Wellcome to NodePop ${existingUser.displayName}`,
        token: token
    });
});
```
- Este token lleva asociada una fecha de caducidad, definida en los parámetro de entorno `JWT_EXP_TIME` y `JWT_EXP_UNIT`
- En cada petición que haga el cliente al API deberá enviar el token para que mediante un método de verificción se verifique que el susuario está logeado. Esta verificación se hace mediante un middleware que se insertará en cada ruta para verificar la autentificación `middlewares/jwtAuth.js`
- En primer lugar se verifica si se ha recibido algún token. Si la respuesta es negativa, se devuelve un error. En el caso afirmativo se verifica, apuntando del `_id` del usuario para que viaje en la petición hasta el siguiente middleware `req.apiUserId = decodedToken.sub;`

```js
module.exports = function() {
    
    return function(req, res, next) {

        // Get token from request
        const token = req.body.token || req.query.token || req.get('x-access-token');
        
        
        if (!token) {
            const err = new Error('No token provided');
            next(err);
            res.status(401);
            return;
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            
            if (err) {
                next(err);
                res.status(401);
                return;
            }

            // Get user id to be used by next middlewares
            req.apiUserId = decodedToken.sub;
      
            // Token is ok -> Go to next middleware
            next();
      
          });
    }
}
```

Es importante acordarse de requerir en cada fichero las librerías que se vayan ha usar.

## Modelo de usuarios

Este modelo se ha definido de forma más amplia a los requerimientos del proyecto, introduciendo algunas propiedades en el modelo de documento:

```js
const userSchema = mongoose.Schema({
    user: { type: String, index: true, unique: true },
    displayName: { type: String, index: true },
    email: { type: String, unique: true, index: true, lowercase: true },
    // { select: false } avoid sending the password to the user when doing get request
    password: { type: String, index: true, select: false },
    avatar: { type: String, index: true },
    singupDate: { type: Date, default: Date.now() },
    lastLoging: Date
});
```
- La propiedad `select: false` del dato `password` nos permite ganar en seguridad impidiendo que se miestro por defecto en cualquier consulta a la base de datos a men que se especifique de forma concreta. De esta forma se pueden listar los documentos sin riesgo de que se muestre información sensible.
- El campo `singupDate` almacena la fecha de suscripción del cliente al servicio.
- También se ha implementado la identificación del gravatar del usario obtenida a partir de su email. Para ello se ha definido un método estático concreto:

```js
userSchema.statics.getGravatar = function (email) {
    return new Promise( (resolve, reject) => {
        let gravatar;
        if (!email) {
        gravatar = `https://gravatar.com/avatar/?s=200&d=retro`;

        } else {
            const md5 = crypto.createHash('md5').update(email) .digest('hex');
            gravatar = `https://gravatar.com/avatar/${md5}?s=200&d=retro`;
        }

        resolve(gravatar);

    })
}
```

