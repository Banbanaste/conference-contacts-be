const mutationSuccess = (code, message, fields) => ({
  code,
  message,
  success: true,
  ...fields
});

const mutationError = error => ({
  code: '500',
  success: false,
  message: `Something went wrong; ${error}`
});

const Mutation = {
  async createUser(_, { data }, { dataSources: { prisma }, decoded }) {
    try {
      const authId = decoded.sub.split('|')[1];
      const userExists = await prisma.$exists.user({ authId });
      if (!userExists) {
        const { email, ...fields } = data;
        const user = await prisma.createUser({ authId, ...fields });
        if (email)
          await prisma.createProfileField({
            value: email,
            type: 'EMAIL',
            privacy: 'PRIVATE',
            preferredContact: true,
            user: { connect: { authId } }
          });
        return mutationSuccess(201, 'User creation successful!', { user });
      } else {
        const user = await prisma.user({ authId });
        return mutationSuccess(409, 'User already exists.', { user });
      }
    } catch (error) {
      return mutationError(error);
    }
  },
  async updateUser(_, { data }, { dataSources: { prisma }, user }) {
    try {
      const updatedUser = await prisma.updateUser({
        data,
        where: { id: user.id }
      });
      return mutationSuccess(200, 'Update successful!', { user: updatedUser });
    } catch (error) {
      return mutationError(error);
    }
  },
  async deleteUser(_, __, { dataSources: { prisma }, user: { id } }) {
    try {
      const user = await prisma.deleteUser({ id });
      return mutationSuccess(204, 'Profile deletion was successful.', { user });
    } catch (error) {
      return mutationError(error);
    }
  },
  async createProfileField(_, { data }, { dataSources: { prisma }, user }) {
    try {
      const profileField = await prisma.createProfileField({
        ...data,
        user: { connect: { id: user.id } }
      });
      return mutationSuccess(201, 'Profile field created successfully!', {
        profileField
      });
    } catch (error) {
      return mutationError(error);
    }
  },
  async createProfileFields(_, { data }, { dataSources: { prisma }, user }) {
    if (!Array.isArray(data))
      return mutationError(`Expected data array, got ${typeof data}`);
    try {
      const profileFields = [];
      for (const mutation of data) {
        const profileField = await prisma.createProfileField({
          ...mutation,
          user: { connect: { id: user.id } }
        });
        profileFields.push(profileField);
      }
      return mutationSuccess(201, 'Profile fields created successfully!', {
        profileFields
      });
    } catch (error) {
      return mutationError(error);
    }
  },
  async updateProfileField(_, { id, data }, { dataSources: { prisma }, user }) {
    try {
      const fieldExists = prisma.$exists.profileField({
        id,
        user: { id: user.id }
      });
      if (fieldExists) {
        const profileField = await prisma.updateProfileField({
          data,
          where: { id }
        });
        return mutationSuccess(200, 'Profile field updated successfully!', {
          profileField
        });
      } else {
        return mutationError('You lack ownership of this field.');
      }
    } catch (error) {
      return mutationError(error);
    }
  },
  async updateProfileFields(_, { data }, { dataSources: { prisma }, user }) {
    if (!Array.isArray(data))
      return mutationError(`Expected data array, got ${typeof data}`);
    try {
      const profileFields = [];
      for (const mutation of data) {
        const { id, ...changes } = mutation;
        const fieldExists = prisma.$exists.profileField({
          id,
          user: { id: user.id }
        });
        if (fieldExists) {
          const profileField = await prisma.updateProfileField({
            data: changes,
            where: { id }
          });
          profileFields.push(profileField);
        } else {
          return mutationError('You lack ownership of this field.');
        }
      }
      return mutationSuccess(200, 'Profile fields updated successfully!', {
        profileFields
      });
    } catch (error) {
      return mutationError(error);
    }
  },
  async deleteProfileField(_, { id }, { dataSources: { prisma }, user }) {
    try {
      const fieldExists = await prisma.$exists.profileField({
        id,
        user: { id: user.id }
      });

      if (!fieldExists) return mutationError('Nice try, mister.');

      const profileField = await prisma.deleteProfileField({ id });
      return mutationSuccess(204, 'User field deleted successfully.', {
        profileField
      });
    } catch (error) {
      return mutationError(error);
    }
  },
  async deleteProfileFields(_, { ids }, { dataSources: { prisma }, user }) {
    if (!Array.isArray(ids))
      return mutationError(`Expected ids array, got ${typeof data}`);
    try {
      const profileFields = [];
      for (const id of ids) {
        const fieldExists = await prisma.$exists.profileField({
          id,
          user: { id: user.id }
        });

        if (!fieldExists) return mutationError('Nice try, mister.');

        const profileField = await prisma.deleteProfileField({ id });
        profileFields.push(profileField);
      }
      return mutationSuccess(204, 'User fields deleted successfully.', {
        profileFields
      });
    } catch (error) {
      return mutationError(error);
    }
  },
  async createQRCode(_, { label }, { dataSources: { prisma }, user }) {
    try {
      const qrcode = await prisma.createQRCode({
        label,
        user: { connect: { id: user.id } }
      });
      return mutationSuccess(201, 'QRCode created successfully!', { qrcode });
    } catch (error) {
      return mutationError(error);
    }
  }
};

module.exports = Mutation;
