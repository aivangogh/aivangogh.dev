import type { Ref } from 'vue'

export function useLockState(
  lockedRegion: Ref<boolean>,
  lockedProvince: Ref<boolean>,
  lockedMunicipality: Ref<boolean>,
) {
  function toggleLock(level: 'r' | 'p' | 'm') {
    if (level === 'r') {
      if (lockedRegion.value) {
        lockedRegion.value = false
        lockedProvince.value = false
        lockedMunicipality.value = false
      } else {
        lockedRegion.value = true
      }
    } else if (level === 'p') {
      if (lockedProvince.value) {
        lockedProvince.value = false
        lockedMunicipality.value = false
      } else {
        lockedProvince.value = true
        lockedRegion.value = true
      }
    } else {
      if (lockedMunicipality.value) {
        lockedMunicipality.value = false
      } else {
        lockedMunicipality.value = true
        lockedProvince.value = true
        lockedRegion.value = true
      }
    }
  }

  return { toggleLock }
}
