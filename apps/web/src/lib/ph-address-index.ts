import {
  getAllRegions,
  getProvincesByRegion,
  getMunicipalitiesByProvince,
  getBarangaysByMunicipality,
} from '@aivangogh/ph-address'

export type BarangayEntry = {
  name: string
  code: string
  municipality: string
  municipalityCode: string
  province: string
  provinceCode: string
  region: string
  regionCode: string
}

let _index: BarangayEntry[] | null = null

export function getBarangayIndex(): BarangayEntry[] {
  if (_index) return _index
  const result: BarangayEntry[] = []
  for (const region of getAllRegions()) {
    for (const province of getProvincesByRegion(region.psgcCode)) {
      for (const mun of getMunicipalitiesByProvince(province.psgcCode)) {
        for (const brgy of getBarangaysByMunicipality(mun.psgcCode)) {
          result.push({
            name: brgy.name,
            code: brgy.psgcCode,
            municipality: mun.name,
            municipalityCode: mun.psgcCode,
            province: province.name,
            provinceCode: province.psgcCode,
            region: region.name,
            regionCode: region.psgcCode,
          })
        }
      }
    }
  }
  _index = result
  return result
}
