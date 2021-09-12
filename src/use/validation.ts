export default function useOnValidateFields(errors: any) {

  const isValid = (value: string) => {
    return errors.value.includes(value)
  }

  return {
    isValid
  }
}