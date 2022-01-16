export default interface IExceptionWithFieldsErrors extends Error {
  fieldsErrors?: Record<string, string[]>;
}
