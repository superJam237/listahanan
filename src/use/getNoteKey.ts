export default function useGetNoteKey() {

  const getNoteKey = async (note: any) : Promise<CryptoKey> => {
    const encoded = new TextEncoder().encode(note) as Uint8Array
    return await window.crypto.subtle.importKey('raw', encoded, 'PBKDF2', false, ['deriveKey'])
  }

  return {
    getNoteKey
  }
}