import { jest } from '@jest/globals'

jest.unstable_mockModule('../src/service/GoogleGeocodeService.js', () => {
  return {
    validateAddress: jest.fn(() => {
      return { success: true, formattedAddress: 'formattedAddress', position: { lat: 1, lng: 1 } }
    })
  }
})
import { Clinic } from '../src/models/ClinicModel.js'

const GoogleGeocodeService = await import('../src/service/GoogleGeocodeService.js')
import ClinicService from '../src/service/ClinicService.js'
import mockingoose from 'mockingoose'

describe('ClinicService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return an error message if required fields are missing', async () => {

    const input = {}
    const expected = { success: false, msg: 'Clinic name and address required' }

    const result = await ClinicService.createClinic(input)

    expect(result).toEqual(expected)
  })

  it('should return an error message if address is invalid', async () => {
    const input = { name: 'name', address: 'address' }
    const expected = { success: false, msg: 'Could not validate address. You can provide coordinates with position.lat and position.lng' }

    GoogleGeocodeService.validateAddress.mockReturnValueOnce({ success: false, msg: 'invalid address' })

    const result = await ClinicService.createClinic(input)

    expect(result).toEqual(expected)
  })

  it('should return an error message if clinic already exists', async () => {
    const input = { name: 'name', address: 'address', position: { lat: 1, lng: 1 } }
    const expected = { success: false, msg: `A clinic named "${input.name}" already exists` }

    mockingoose(Clinic).toReturn(() => { throw { code: 11000 } }, 'save')
    const result = await ClinicService.createClinic(input)

    expect(result).toEqual(expected)
  })

  it('should create a new clinic', async () => {
    const input = { name: 'name', address: 'address', position: { lat: 1, lng: 1 } }

    mockingoose(Clinic).toReturn(input, 'save')

    const result = await ClinicService.createClinic(input)

    expect(result.success).toBe(true)
  })
})