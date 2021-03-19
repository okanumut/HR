/* eslint-disable */
/*
 * Copyright 2019-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

const { CognitoIdentityServiceProvider } = require('aws-sdk')

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider()
const userPoolId = process.env.USERPOOL

async function addUserToGroup(username, groupname) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    Username: username,
  }

  console.log(`Attempting to add ${username} to ${groupname}`)

  try {
    const result = await cognitoIdentityServiceProvider
      .adminAddUserToGroup(params)
      .promise()
    console.log(`Success adding ${username} to ${groupname}`)
    return {
      message: `Success adding ${username} to ${groupname}`,
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}
async function deleteUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  }

  console.log(`Delete ${username}`)

  try {
    const result = await cognitoIdentityServiceProvider
      .adminDeleteUser(params)
      .promise()
    console.log(`Successfull Delete ${username}`)
    return {
      message: `Successfull Delete ${username}`,
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}
async function createUser(username, email, groupname, phone_number) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
    DesiredDeliveryMediums: ['EMAIL'],
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
      {
        Name: 'custom:group',
        Value: groupname,
      },
      {
        Name: 'phone_number',
        Value: phone_number,
      },
    ],
  }

  console.log(`Attempting to create ${username} with ${email}`)

  try {
    const result = await cognitoIdentityServiceProvider
      .adminCreateUser(params)
      .promise()
    console.log(`Success creating ${username} with ${email}`)
    return {
      message: `Success creating ${username} with ${email}`,
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function removeUserFromGroup(username, groupname) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    Username: username,
  }

  console.log(`Attempting to remove ${username} from ${groupname}`)

  try {
    const result = await cognitoIdentityServiceProvider
      .adminRemoveUserFromGroup(params)
      .promise()
    console.log(`Removed ${username} from ${groupname}`)
    return {
      message: `Removed ${username} from ${groupname}`,
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

// Confirms as an admin without using a confirmation code.
async function confirmUserSignUp(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  }

  try {
    const result = await cognitoIdentityServiceProvider
      .adminConfirmSignUp(params)
      .promise()
    console.log(`Confirmed ${username} registration`)
    return {
      message: `Confirmed ${username} registration`,
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function disableUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  }

  try {
    const result = await cognitoIdentityServiceProvider
      .adminDisableUser(params)
      .promise()
    console.log(`Disabled ${username}`)
    return {
      message: `Disabled ${username}`,
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function enableUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  }

  try {
    const result = await cognitoIdentityServiceProvider
      .adminEnableUser(params)
      .promise()
    console.log(`Enabled ${username}`)
    return {
      message: `Enabled ${username}`,
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function getUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  }

  console.log(`Attempting to retrieve information for ${username}`)

  try {
    const result = await cognitoIdentityServiceProvider
      .adminGetUser(params)
      .promise()
    return result
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function listUsers(Limit, PaginationToken) {
  const params = {
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(PaginationToken && { PaginationToken }),
  }

  console.log('Attempting to list users')

  try {
    const result = await cognitoIdentityServiceProvider
      .listUsers(params)
      .promise()

    // Rename to NextToken for consistency with other Cognito APIs
    result.NextToken = result.PaginationToken
    delete result.PaginationToken

    return result
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function listGroupsForUser(username, Limit, NextToken) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
    ...(Limit && { Limit }),
    ...(NextToken && { NextToken }),
  }

  console.log(`Attempting to list groups for ${username}`)

  try {
    const result = await cognitoIdentityServiceProvider
      .adminListGroupsForUser(params)
      .promise()
    /**
     * We are filtering out the results that seem to be innapropriate for client applications
     * to prevent any informaiton disclosure. Customers can modify if they have the need.
     */
    result.Groups.forEach((val) => {
      delete val.UserPoolId,
        delete val.LastModifiedDate,
        delete val.CreationDate,
        delete val.Precedence,
        delete val.RoleArn
    })

    return result
  } catch (err) {
    console.log(err)
    throw err
  }
}
//sdfs
async function listUsersInGroup(groupname, Limit, NextToken) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(NextToken && { NextToken }),
  }

  console.log(`Attempting to list users in group ${groupname}`)

  try {
    const result = await cognitoIdentityServiceProvider
      .listUsersInGroup(params)
      .promise()
    return result
  } catch (err) {
    console.log(err)
    throw err
  }
}

// Signs out from all devices, as an administrator.
async function signUserOut(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  }

  console.log(`Attempting to signout ${username}`)

  try {
    const result = await cognitoIdentityServiceProvider
      .adminUserGlobalSignOut(params)
      .promise()
    console.log(`Signed out ${username} from all devices`)
    return {
      message: `Signed out ${username} from all devices`,
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

module.exports = {
  addUserToGroup,
  createUser,
  removeUserFromGroup,
  confirmUserSignUp,
  disableUser,
  enableUser,
  getUser,
  listUsers,
  listGroupsForUser,
  listUsersInGroup,
  signUserOut,
  deleteUser,
}