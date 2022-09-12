design doc
## Background
+ Set the backend total technical design and environment.
## All functions
+ From design: 
+ [Security center solution](https://github.com/proofofsoulprotocol/smart-contract-wallet-4337/blob/main/dev-docs/security-center-solution.md)
+ [Social recovery solution](https://github.com/proofofsoulprotocol/smart-contract-wallet-4337/blob/main/dev-docs/Social-recovery-solution.md)
+ ![See the flow](recovery-sequence-diagram.png)
### APIs
+ APIs for Chrome plugin 
+ 1. verifyEmail, input: email, output: random number(6) in mail.
+ 2. verifyEmailNum, input: email, random number, output: true or false.
+ 3. addUser, input: email, wallet_address(unique,not required), output: true or false; async invoke after finished the create account action with onchain contract.
+ 4. updateUserGuardian, input: email, guardians, output: true or false; async invoke after finished the setting guardian action with onchain contract.
+ 5. updateUserAccount, input: email, wallet_address(unique, required), output: true or false; async invoke after finished the activating account action with onchain contract.
+ 6. isWalletOwner, input email, output: true or false.
+ 7. addRecoveryRecord, input: email, wallet_address, output: true or false.
+ 8. fetchRecoveryRecords, input: email, output: false or record structure.
+ 9. updateRecoveryRecord, input: email, guardian-address(single update), output: true or false; after sign onchain, async invoke this method to mark specific guardian has signed.
+ 10. getGuardiansWallet
+ 11. getWalletsRecoveryRecords
+ 12. getGuardianSetting, it will return a PoC product setting formate, it can be stored in the User object or a individual setting Object, to be discussed. input: email, output: User obj or setting obj.
+ 
```
{
    "total": 5,
    "min": 3,
    "setting": "3/5"
}
```
+ 


## Collections(Objects)
### Users
+ model/user.js
```
  { 
    "email": "testshuaishuai@gmail.com",
    "wallet-address": "a contract wallet address",
    "guardians": [
        {
            "type":"EOA",
            "address":"0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
            "signature": "LIJOEIUR09328049sjdijf" //data was signed
        },
        {},{}],
    <!-- "status": "created, activated, recovering, recovered" -->
  }
```
### VerifyRecords
+ model/verification.js
```
{
    email: "aa@aa.net",
    code: "234567",
    date: date type,
}
```
### Guardians
+ TODO
+ Guardians save in the users collection.
+ We will add Guardians obj in future for index from guardians view.
+ 
```
{
    guardian_address: "asdf234gg",
    wallet_address: [asdfadf,123123,23213,2323]
}
```

### RecoveryRecords
```
recovery record structure
{
  email: "aa@aa.com",
  wallet_address: "lajsdf09rp23092-3jsdksdf",
  recovery_records: [
      {
          guardian_address: "asdfadf23234233",
          sign_status: true
      },
      {
          guardian_address: "sdfk8878dglkdg0g",
          sign_status: false
      },
      {
          guardian_address: "ksjdlfj0808092834g",
          sign_status: false
      }
  ]
}
```

## Internal and Utils
### MakeResponse
+ Input parameter, return response json formate.

### SendEmail

## Global
### API request and response
```
response return data structure 
{   
  method: triggerRecovery, 
  code: 200, 
  status : OK, 
  params: {data structure},
  msg: "msgs returned",
  hash: hash
}
or
{   
  method: triggerRecovery, 
  code: 4001, 
  status : Error, 
  params: {data structure},
  msg: "msgs returned",
  hash: hash
}
*******

```



