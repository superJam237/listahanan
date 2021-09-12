export default function useDeriveKey() {

  const deriveKey = async (keyNote: CryptoKey, salt: Uint8Array, keyUsage: Array<any>) : Promise<CryptoKey> => {
    return await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyNote,
      { name: "AES-GCM", length: 256 },
      false,
      keyUsage     
    )
  }
  
  return {
    deriveKey
  }
}