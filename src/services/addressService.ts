import Address, { type IAddress } from "../models/Address"
import { NotFoundError } from "../utils/errors"

export const getAddressesByUser = async (userId: string): Promise<IAddress[]> => {
  return Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 })
}

export const getAddressById = async (id: string, userId: string): Promise<IAddress> => {
  const address = await Address.findOne({ _id: id, user: userId })

  if (!address) {
    throw new NotFoundError(`Address with ID ${id} not found`)
  }

  return address
}

export const createAddress = async (
  userId: string,
  addressText: string,
  phone: string,
  isDefault = false,
): Promise<IAddress> => {
  // If this is the default address, unset any existing default
  if (isDefault) {
    await Address.updateMany({ user: userId, isDefault: true }, { isDefault: false })
  }

  // Create new address
  const address = new Address({
    user: userId,
    address: addressText,
    phone,
    isDefault,
  })

  return address.save()
}

export const updateAddress = async (id: string, userId: string, addressData: Partial<IAddress>): Promise<IAddress> => {
  const { address, phone, isDefault } = addressData

  // Check if address exists
  await getAddressById(id, userId)

  // If setting as default, unset any existing default
  if (isDefault) {
    await Address.updateMany({ user: userId, isDefault: true }, { isDefault: false })
  }

  // Update address
  const updatedAddress = await Address.findOneAndUpdate(
    { _id: id, user: userId },
    { address, phone, isDefault },
    { new: true, runValidators: true },
  )

  if (!updatedAddress) {
    throw new NotFoundError(`Address with ID ${id} not found`)
  }

  return updatedAddress
}

export const deleteAddress = async (id: string, userId: string): Promise<void> => {
  // Check if address exists
  const address = await getAddressById(id, userId)

  // Delete address
  await Address.findByIdAndDelete(id)

  // If this was the default address, set another address as default
  if (address.isDefault) {
    const addresses = await getAddressesByUser(userId)

    if (addresses.length > 0) {
      await Address.findByIdAndUpdate(addresses[0]._id, { isDefault: true })
    }
  }
}

