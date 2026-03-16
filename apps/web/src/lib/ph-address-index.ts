import {
  getAllRegions,
  getProvincesByRegion,
  getMunicipalitiesByProvince,
  getBarangaysByMunicipality,
} from '@aivangogh/ph-address'

export type SearchLevel = 'region' | 'province' | 'municipality' | 'barangay'

export type SearchEntry = {
  level: SearchLevel
  name: string
  code: string
  // Parent context — always refers to the PARENT, never self.
  // e.g. for a municipality entry, municipality='' and province=parent province.
  municipality: string
  municipalityCode: string
  province: string
  provinceCode: string
  region: string
  regionCode: string
}

// Backward-compat alias
export type BarangayEntry = SearchEntry

let _index: SearchEntry[] | null = null

export function getSearchIndex(): SearchEntry[] {
  if (_index) return _index
  const result: SearchEntry[] = []
  for (const region of getAllRegions()) {
    result.push({
      level: 'region',
      name: region.name,
      code: region.psgcCode,
      municipality: '',
      municipalityCode: '',
      province: '',
      provinceCode: '',
      region: region.name,
      regionCode: region.psgcCode,
    })
    for (const province of getProvincesByRegion(region.psgcCode)) {
      result.push({
        level: 'province',
        name: province.name,
        code: province.psgcCode,
        municipality: '',
        municipalityCode: '',
        province: '',
        provinceCode: province.psgcCode,
        region: region.name,
        regionCode: region.psgcCode,
      })
      for (const mun of getMunicipalitiesByProvince(province.psgcCode)) {
        result.push({
          level: 'municipality',
          name: mun.name,
          code: mun.psgcCode,
          municipality: '',
          municipalityCode: mun.psgcCode,
          province: province.name,
          provinceCode: province.psgcCode,
          region: region.name,
          regionCode: region.psgcCode,
        })
        for (const brgy of getBarangaysByMunicipality(mun.psgcCode)) {
          result.push({
            level: 'barangay',
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

export function getBarangayIndex(): SearchEntry[] {
  return getSearchIndex().filter((e) => e.level === 'barangay')
}
