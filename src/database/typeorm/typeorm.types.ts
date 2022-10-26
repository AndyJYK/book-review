import { CannotCreateEntityIdMapError, EntityNotFoundError, QueryFailedError, TypeORMError } from "typeorm";

const CustomTypeORMError =
    TypeORMError ||
    QueryFailedError ||
    EntityNotFoundError ||
    CannotCreateEntityIdMapError;

