design doc
## Background
+ Set the backend total technical environment .
## All functions
### APIs
+ APIs for Chrome plugin 
+ 1. verifyEmail, input: email, output: random number(6) in mail.
+ 2. verifyEmailNum, input: email, random number, output: true or false.
+ 3. verifyOwnerMail, input email, output: true or false.
+ 4. saveWalletAddress, input: email, wallet_address,[public-key(EOA address)], output: true or false.
+ 5. addRecoveryRecord, input: email, wallet_address, output: true or false.
+ 6. fetchRecoveryRecords, input: email, output: false or record structure.


## Collections(Objects)
### Users
### VerifyRecords
### Guardians
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



