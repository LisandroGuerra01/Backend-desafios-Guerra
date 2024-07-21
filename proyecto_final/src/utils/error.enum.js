export const ErrorName = {
    NOT_FOUND: "NO_ENCONTRADO",
    BAD_REQUEST: "SOLICITUD_INCORRECTA",
    UNAUTHORIZED: "NO_AUTORIZADO",
    FORBIDDEN: "PROHIBIDO",
    CONFLICT: "CONFLICTO",
    INTERNAL_SERVER_ERROR: "ERROR_INTERNO_DEL_SERVIDOR",
    BAD_GATEWAY: "PUERTA_DE_ENLACE_INCORRECTA",
    SERVICE_UNAVAILABLE: "SERVICIO_NO_DISPONIBLE",
    GATEWAY_TIMEOUT: "TIEMPO_DE_ESPERA_DE_LA_PUERTA_DE_ENLACE",
    NETWORK_AUTHENTICATION_REQUIRED: "AUTENTICACIÓN_DE_RED_REQUERIDA",
    CUSTOM_ERROR: "ERROR_PERSONALIZADO",
};

export const ErrorMessage = {
    NOT_FOUND: "No Encontrado",
    BAD_REQUEST: "Solicitud Incorrecta",
    UNAUTHORIZED: "No Autorizado",
    FORBIDDEN: "Prohibido",
    CONFLICT: "Conflicto",
    INTERNAL_SERVER_ERROR: "Error Interno del Servidor",
    BAD_GATEWAY: "Puerta de Enlace Incorrecta",
    SERVICE_UNAVAILABLE: "Servicio No Disponible",
    GATEWAY_TIMEOUT: "Tiempo de Espera de la Puerta de Enlace",
    NETWORK_AUTHENTICATION_REQUIRED: "Autenticación de Red Requerida",
    CUSTOM_ERROR: "Error Personalizado",
};

export const ErrorCause = {
    NOT_FOUND: "El recurso solicitado no pudo ser encontrado pero puede estar disponible en el futuro. Se permiten solicitudes posteriores por parte del cliente.",
    BAD_REQUEST: "El servidor no puede o no procesará la solicitud debido a un error aparente del cliente.",
    UNAUTHORIZED: "La solicitud no se ha aplicado porque carece de credenciales de autenticación válidas para el recurso objetivo.",
    FORBIDDEN: "El servidor entendió la solicitud pero se niega a autorizarla.",
    CONFLICT: "La solicitud no pudo completarse debido a un conflicto con el estado actual del recurso objetivo.",
    INTERNAL_SERVER_ERROR: "Un mensaje de error genérico, dado cuando se encuentra una condición inesperada y no es adecuado ningún mensaje más específico.",
    BAD_GATEWAY: "El servidor actuaba como una puerta de enlace o proxy y recibió una respuesta no válida del servidor ascendente.",
    SERVICE_UNAVAILABLE: "El servidor no puede manejar la solicitud (porque está sobrecargado o en mantenimiento). Generalmente, este es un estado temporal.",
    GATEWAY_TIMEOUT: "El servidor actuaba como una puerta de enlace o proxy y no recibió una respuesta oportuna del servidor ascendente.",
    NETWORK_AUTHENTICATION_REQUIRED: "El cliente necesita autenticarse para obtener acceso a la red.",
    CUSTOM_ERROR: "Error Personalizado",
};
