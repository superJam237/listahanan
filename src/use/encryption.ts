export default function useEncryption(deriveKey: any, getNoteKey: any, buff_to_base64: any) {
  const encryptNote = async (secretData: any, note: string) : Promise<any> => {
    try {
      const jsonStr = JSON.stringify(secretData)
      const encoded = new TextEncoder().encode(jsonStr)
      const salt = window.crypto.getRandomValues(new Uint8Array(16))
      const iv = window.crypto.getRandomValues(new Uint8Array(12))
      const keyNote = await getNoteKey(note)
      const aesKey = await deriveKey(keyNote, salt, ["encrypt"])
      const ciphertext = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv
        },
        aesKey,
        encoded
      )

      const encryptedDataArr = new Uint8Array(ciphertext)
      const buff = new Uint8Array(salt.byteLength + iv.byteLength + encryptedDataArr.byteLength)

      buff.set(salt, 0)
      buff.set(iv, salt.byteLength)
      buff.set(encryptedDataArr, salt.byteLength + iv.byteLength)

      const base64Buff = buff_to_base64(buff)

      return base64Buff

    } catch (error) {
      console.log(`Error - ${error}`);
    }
  } 

  return {
    encryptNote
  }
}