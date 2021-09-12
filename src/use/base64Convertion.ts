export default function useBuffBase64() {
  const buff_to_base64 = (buff: any): string => btoa(String.fromCharCode.apply(null, buff))  

  return {
    buff_to_base64
  }
}