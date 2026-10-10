import React from 'react';

export type SOSNumber = {
  name: string;
  number: string;
};

export type SOSData = {
  [country: string]: SOSNumber[];
};

export const SOS_NUMBERS: SOSData = {
  Afghanistan: [
    {name: 'Police', number: '119'},
    {name: 'Ambulance', number: '102'},
    {name: 'Fire', number: '119'},
  ],
  Albania: [
    {name: 'Police', number: '129'},
    {name: 'Ambulance', number: '127'},
    {name: 'Fire', number: '128'},
  ],
  Algeria: [
    {name: 'Police', number: '1548'},
    {name: 'Ambulance', number: '14'},
    {name: 'Fire', number: '14'},
  ],
  Andorra: [
    {name: 'Police', number: '110'},
    {name: 'Ambulance', number: '116'},
    {name: 'Fire', number: '118'},
  ],
  Angola: [
    {name: 'Police', number: '113'},
    {name: 'Ambulance', number: '112'},
    {name: 'Fire', number: '115'},
  ],
  'Antigua and Barbuda': [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '911'},
  ],
  Argentina: [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '107'},
    {name: 'Fire', number: '100'},
  ],
  Armenia: [
    {name: 'Police', number: '102'},
    {name: 'Ambulance', number: '103'},
    {name: 'Fire', number: '101'},
  ],
  Australia: [
    {name: 'Police/Ambulance/Fire', number: '000'},
    {name: 'Lifeline', number: '13 11 14'},
    {name: 'SES Emergency', number: '132 500'},
  ],
  Austria: [
    {name: 'Police', number: '133'},
    {name: 'Ambulance', number: '144'},
    {name: 'Fire', number: '122'},
    {name: 'Emergency', number: '112'},
  ],
  Azerbaijan: [
    {name: 'Police', number: '102'},
    {name: 'Ambulance', number: '103'},
    {name: 'Fire', number: '101'},
  ],
  Bahamas: [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '911'},
  ],
  Bahrain: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '999'},
    {name: 'Fire', number: '999'},
  ],
  Bangladesh: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '199'},
    {name: 'Fire', number: '199'},
  ],
  Barbados: [
    {name: 'Police', number: '211'},
    {name: 'Ambulance', number: '511'},
    {name: 'Fire', number: '311'},
  ],
  Belarus: [
    {name: 'Police', number: '102'},
    {name: 'Ambulance', number: '103'},
    {name: 'Fire', number: '101'},
  ],
  Belgium: [
    {name: 'Police', number: '101'},
    {name: 'Ambulance', number: '100'},
    {name: 'Fire', number: '100'},
    {name: 'Emergency', number: '112'},
  ],
  Belize: [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '90'},
    {name: 'Fire', number: '90'},
  ],
  Benin: [
    {name: 'Police', number: '117'},
    {name: 'Ambulance', number: '112'},
    {name: 'Fire', number: '118'},
  ],
  Bhutan: [
    {name: 'Police', number: '113'},
    {name: 'Ambulance', number: '112'},
    {name: 'Fire', number: '110'},
  ],
  Bolivia: [
    {name: 'Police', number: '110'},
    {name: 'Ambulance', number: '118'},
    {name: 'Fire', number: '119'},
  ],
  'Bosnia and Herzegovina': [
    {name: 'Police', number: '122'},
    {name: 'Ambulance', number: '124'},
    {name: 'Fire', number: '123'},
  ],
  Botswana: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '997'},
    {name: 'Fire', number: '998'},
  ],
  Brazil: [
    {name: 'Police', number: '190'},
    {name: 'Ambulance', number: '192'},
    {name: 'Fire', number: '193'},
  ],
  Brunei: [
    {name: 'Police', number: '993'},
    {name: 'Ambulance', number: '991'},
    {name: 'Fire', number: '995'},
  ],
  Bulgaria: [
    {name: 'Police', number: '166'},
    {name: 'Ambulance', number: '150'},
    {name: 'Fire', number: '160'},
    {name: 'Emergency', number: '112'},
  ],
  'Burkina Faso': [
    {name: 'Police', number: '17'},
    {name: 'Ambulance', number: '15'},
    {name: 'Fire', number: '18'},
  ],
  Burundi: [
    {name: 'Police', number: '117'},
    {name: 'Ambulance', number: '112'},
    {name: 'Fire', number: '118'},
  ],
  'Cabo Verde': [
    {name: 'Police', number: '132'},
    {name: 'Ambulance', number: '130'},
    {name: 'Fire', number: '131'},
  ],
  Cambodia: [
    {name: 'Police', number: '117'},
    {name: 'Ambulance', number: '119'},
    {name: 'Fire', number: '118'},
  ],
  Cameroon: [
    {name: 'Police', number: '117'},
    {name: 'Ambulance', number: '119'},
    {name: 'Fire', number: '118'},
  ],
  Canada: [
    {name: 'Police/Ambulance/Fire', number: '911'},
    {name: 'Poison Control', number: '1-800-268-9017'},
    {name: 'Crisis Line', number: '1-833-456-4566'},
  ],
  'Central African Republic': [
    {name: 'Police', number: '117'},
    {name: 'Ambulance', number: '1220'},
    {name: 'Fire', number: '118'},
  ],
  Chad: [
    {name: 'Police', number: '17'},
    {name: 'Ambulance', number: '15'},
    {name: 'Fire', number: '18'},
  ],
  Chile: [
    {name: 'Police', number: '133'},
    {name: 'Ambulance', number: '131'},
    {name: 'Fire', number: '132'},
  ],
  China: [
    {name: 'Police', number: '110'},
    {name: 'Ambulance', number: '120'},
    {name: 'Fire', number: '119'},
  ],
  Colombia: [
    {name: 'Police', number: '123'},
    {name: 'Ambulance', number: '125'},
    {name: 'Fire', number: '119'},
  ],
  Comoros: [
    {name: 'Police', number: '17'},
    {name: 'Ambulance', number: '15'},
    {name: 'Fire', number: '18'},
  ],
  'Congo (Brazzaville)': [
    {name: 'Police', number: '117'},
    {name: 'Ambulance', number: '15'},
    {name: 'Fire', number: '18'},
  ],
  'Congo (Kinshasa)': [
    {name: 'Police', number: '112'},
    {name: 'Ambulance', number: '999'},
    {name: 'Fire', number: '112'},
  ],
  'Costa Rica': [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '911'},
  ],
  Croatia: [
    {name: 'Police', number: '192'},
    {name: 'Ambulance', number: '194'},
    {name: 'Fire', number: '193'},
    {name: 'Emergency', number: '112'},
  ],
  Cuba: [
    {name: 'Police', number: '106'},
    {name: 'Ambulance', number: '104'},
    {name: 'Fire', number: '105'},
  ],
  Cyprus: [
    {name: 'Police', number: '199'},
    {name: 'Ambulance', number: '199'},
    {name: 'Fire', number: '199'},
    {name: 'Emergency', number: '112'},
  ],
  'Czech Republic': [
    {name: 'Police', number: '158'},
    {name: 'Ambulance', number: '155'},
    {name: 'Fire', number: '150'},
    {name: 'Emergency', number: '112'},
  ],
  Denmark: [
    {name: 'Police/Ambulance/Fire', number: '112'},
    {name: 'Non-emergency Police', number: '114'},
  ],
  Djibouti: [
    {name: 'Police', number: '17'},
    {name: 'Ambulance', number: '351351'},
    {name: 'Fire', number: '18'},
  ],
  Dominica: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '999'},
    {name: 'Fire', number: '999'},
  ],
  'Dominican Republic': [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '911'},
  ],
  Ecuador: [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '911'},
  ],
  Egypt: [
    {name: 'Police', number: '122'},
    {name: 'Ambulance', number: '123'},
    {name: 'Fire', number: '180'},
  ],
  'El Salvador': [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '913'},
  ],
  'Equatorial Guinea': [
    {name: 'Police', number: '114'},
    {name: 'Ambulance', number: '115'},
    {name: 'Fire', number: '112'},
  ],
  Eritrea: [
    {name: 'Police', number: '127'},
    {name: 'Ambulance', number: '114'},
    {name: 'Fire', number: '116'},
  ],
  Estonia: [
    {name: 'Police', number: '110'},
    {name: 'Ambulance', number: '112'},
    {name: 'Fire', number: '112'},
    {name: 'Emergency', number: '112'},
  ],
  Eswatini: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '977'},
    {name: 'Fire', number: '933'},
  ],
  Ethiopia: [
    {name: 'Police', number: '991'},
    {name: 'Ambulance', number: '907'},
    {name: 'Fire', number: '939'},
  ],
  Fiji: [
    {name: 'Police', number: '917'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '910'},
  ],
  Finland: [{name: 'Police/Ambulance/Fire', number: '112'}],
  France: [
    {name: 'Police', number: '17'},
    {name: 'Ambulance', number: '15'},
    {name: 'Fire', number: '18'},
    {name: 'Emergency', number: '112'},
  ],
  Gabon: [
    {name: 'Police', number: '1730'},
    {name: 'Ambulance', number: '1300'},
    {name: 'Fire', number: '18'},
  ],
  Gambia: [
    {name: 'Police', number: '117'},
    {name: 'Ambulance', number: '116'},
    {name: 'Fire', number: '118'},
  ],
  Georgia: [
    {name: 'Police', number: '122'},
    {name: 'Ambulance', number: '113'},
    {name: 'Fire', number: '111'},
  ],
  Germany: [
    {name: 'Police', number: '110'},
    {name: 'Ambulance', number: '112'},
    {name: 'Fire', number: '112'},
    {name: 'Emergency', number: '112'},
  ],
  Ghana: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '193'},
    {name: 'Fire', number: '192'},
  ],
  Greece: [
    {name: 'Police', number: '100'},
    {name: 'Ambulance', number: '166'},
    {name: 'Fire', number: '199'},
    {name: 'Emergency', number: '112'},
  ],
  Grenada: [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '434'},
    {name: 'Fire', number: '112'},
  ],
  Guatemala: [
    {name: 'Police', number: '110'},
    {name: 'Ambulance', number: '123'},
    {name: 'Fire', number: '122'},
  ],
  Guinea: [
    {name: 'Police', number: '117'},
    {name: 'Ambulance', number: '442020'},
    {name: 'Fire', number: '118'},
  ],
  'Guinea-Bissau': [
    {name: 'Police', number: '117'},
    {name: 'Ambulance', number: '119'},
    {name: 'Fire', number: '118'},
  ],
  Guyana: [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '913'},
    {name: 'Fire', number: '912'},
  ],
  Haiti: [
    {name: 'Police', number: '114'},
    {name: 'Ambulance', number: '116'},
    {name: 'Fire', number: '115'},
  ],
  Honduras: [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '198'},
  ],
  Hungary: [
    {name: 'Police', number: '107'},
    {name: 'Ambulance', number: '104'},
    {name: 'Fire', number: '105'},
    {name: 'Emergency', number: '112'},
  ],
  Iceland: [{name: 'Police/Ambulance/Fire', number: '112'}],
  India: [
    {name: 'Police', number: '100'},
    {name: 'Ambulance', number: '108'},
    {name: 'Fire', number: '101'},
    {name: 'Women Helpline', number: '181'},
    {name: 'Child Helpline', number: '1098'},
  ],
  Indonesia: [
    {name: 'Police', number: '110'},
    {name: 'Ambulance', number: '118'},
    {name: 'Fire', number: '113'},
  ],
  Iran: [
    {name: 'Police', number: '110'},
    {name: 'Ambulance', number: '115'},
    {name: 'Fire', number: '125'},
  ],
  Iraq: [
    {name: 'Police', number: '104'},
    {name: 'Ambulance', number: '122'},
    {name: 'Fire', number: '115'},
  ],
  Ireland: [
    {name: 'Police/Ambulance/Fire', number: '999'},
    {name: 'Emergency', number: '112'},
  ],
  Israel: [
    {name: 'Police', number: '100'},
    {name: 'Ambulance', number: '101'},
    {name: 'Fire', number: '102'},
  ],
  Italy: [
    {name: 'Police', number: '113'},
    {name: 'Ambulance', number: '118'},
    {name: 'Fire', number: '115'},
    {name: 'Emergency', number: '112'},
  ],
  'Ivory Coast': [
    {name: 'Police', number: '170'},
    {name: 'Ambulance', number: '185'},
    {name: 'Fire', number: '180'},
  ],
  Jamaica: [
    {name: 'Police', number: '119'},
    {name: 'Ambulance', number: '110'},
    {name: 'Fire', number: '110'},
  ],
  Japan: [
    {name: 'Police', number: '110'},
    {name: 'Ambulance/Fire', number: '119'},
  ],
  Jordan: [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '911'},
  ],
  Kazakhstan: [
    {name: 'Police', number: '102'},
    {name: 'Ambulance', number: '103'},
    {name: 'Fire', number: '101'},
  ],
  Kenya: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '999'},
    {name: 'Fire', number: '999'},
  ],
  Kiribati: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '994'},
    {name: 'Fire', number: '998'},
  ],
  Kuwait: [
    {name: 'Police', number: '112'},
    {name: 'Ambulance', number: '777'},
    {name: 'Fire', number: '777'},
  ],
  Kyrgyzstan: [
    {name: 'Police', number: '102'},
    {name: 'Ambulance', number: '103'},
    {name: 'Fire', number: '101'},
  ],
  Laos: [
    {name: 'Police', number: '191'},
    {name: 'Ambulance', number: '195'},
    {name: 'Fire', number: '190'},
  ],
  Latvia: [
    {name: 'Police', number: '110'},
    {name: 'Ambulance', number: '113'},
    {name: 'Fire', number: '112'},
    {name: 'Emergency', number: '112'},
  ],
  Lebanon: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '140'},
    {name: 'Fire', number: '175'},
  ],
  Lesotho: [
    {name: 'Police', number: '123'},
    {name: 'Ambulance', number: '121'},
    {name: 'Fire', number: '122'},
  ],
  Liberia: [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '911'},
  ],
  Libya: [
    {name: 'Police', number: '193'},
    {name: 'Ambulance', number: '193'},
    {name: 'Fire', number: '193'},
  ],
  Liechtenstein: [
    {name: 'Police', number: '117'},
    {name: 'Ambulance', number: '144'},
    {name: 'Fire', number: '118'},
  ],
  Lithuania: [
    {name: 'Police', number: '102'},
    {name: 'Ambulance', number: '103'},
    {name: 'Fire', number: '101'},
    {name: 'Emergency', number: '112'},
  ],
  Luxembourg: [
    {name: 'Police', number: '113'},
    {name: 'Ambulance', number: '112'},
    {name: 'Fire', number: '112'},
    {name: 'Emergency', number: '112'},
  ],
  Madagascar: [
    {name: 'Police', number: '117'},
    {name: 'Ambulance', number: '124'},
    {name: 'Fire', number: '118'},
  ],
  Malawi: [
    {name: 'Police', number: '997'},
    {name: 'Ambulance', number: '998'},
    {name: 'Fire', number: '999'},
  ],
  Malaysia: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '999'},
    {name: 'Fire', number: '994'},
  ],
  Maldives: [
    {name: 'Police', number: '119'},
    {name: 'Ambulance', number: '102'},
    {name: 'Fire', number: '118'},
  ],
  Mali: [
    {name: 'Police', number: '17'},
    {name: 'Ambulance', number: '15'},
    {name: 'Fire', number: '18'},
  ],
  Malta: [
    {name: 'Police', number: '191'},
    {name: 'Ambulance', number: '196'},
    {name: 'Fire', number: '199'},
    {name: 'Emergency', number: '112'},
  ],
  'Marshall Islands': [
    {name: 'Police', number: '625-8666'},
    {name: 'Ambulance', number: '625-4144'},
    {name: 'Fire', number: '625-3333'},
  ],
  Mauritania: [
    {name: 'Police', number: '117'},
    {name: 'Ambulance', number: '101'},
    {name: 'Fire', number: '118'},
  ],
  Mauritius: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '114'},
    {name: 'Fire', number: '995'},
  ],
  Mexico: [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '911'},
  ],
  Micronesia: [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '911'},
  ],
  Moldova: [
    {name: 'Police', number: '902'},
    {name: 'Ambulance', number: '903'},
    {name: 'Fire', number: '901'},
  ],
  Monaco: [
    {name: 'Police', number: '17'},
    {name: 'Ambulance', number: '15'},
    {name: 'Fire', number: '18'},
  ],
  Mongolia: [
    {name: 'Police', number: '102'},
    {name: 'Ambulance', number: '103'},
    {name: 'Fire', number: '101'},
  ],
  Montenegro: [
    {name: 'Police', number: '122'},
    {name: 'Ambulance', number: '124'},
    {name: 'Fire', number: '123'},
  ],
  Morocco: [
    {name: 'Police', number: '19'},
    {name: 'Ambulance', number: '15'},
    {name: 'Fire', number: '15'},
  ],
  Mozambique: [
    {name: 'Police', number: '119'},
    {name: 'Ambulance', number: '117'},
    {name: 'Fire', number: '198'},
  ],
  Myanmar: [
    {name: 'Police', number: '199'},
    {name: 'Ambulance', number: '192'},
    {name: 'Fire', number: '191'},
  ],
  Namibia: [
    {name: 'Police', number: '10111'},
    {name: 'Ambulance', number: '2032276'},
    {name: 'Fire', number: '2032270'},
  ],
  Nauru: [
    {name: 'Police', number: '110'},
    {name: 'Ambulance', number: '117'},
    {name: 'Fire', number: '118'},
  ],
  Nepal: [
    {name: 'Police', number: '100'},
    {name: 'Ambulance', number: '102'},
    {name: 'Fire', number: '101'},
  ],
  Netherlands: [
    {name: 'Police/Ambulance/Fire', number: '112'},
    {name: 'Non-emergency Police', number: '0900-8844'},
  ],
  'New Zealand': [{name: 'Police/Ambulance/Fire', number: '111'}],
  Nicaragua: [
    {name: 'Police', number: '118'},
    {name: 'Ambulance', number: '128'},
    {name: 'Fire', number: '115'},
  ],
  Niger: [
    {name: 'Police', number: '17'},
    {name: 'Ambulance', number: '15'},
    {name: 'Fire', number: '18'},
  ],
  Nigeria: [
    {name: 'Police', number: '199'},
    {name: 'Ambulance', number: '199'},
    {name: 'Fire', number: '199'},
  ],
  'North Korea': [
    {name: 'Police', number: '119'},
    {name: 'Ambulance', number: '119'},
    {name: 'Fire', number: '119'},
  ],
  'North Macedonia': [
    {name: 'Police', number: '192'},
    {name: 'Ambulance', number: '194'},
    {name: 'Fire', number: '193'},
  ],
  Norway: [
    {name: 'Police', number: '112'},
    {name: 'Ambulance', number: '113'},
    {name: 'Fire', number: '110'},
  ],
  Oman: [
    {name: 'Police', number: '9999'},
    {name: 'Ambulance', number: '9999'},
    {name: 'Fire', number: '9999'},
  ],
  Pakistan: [
    {name: 'Police', number: '15'},
    {name: 'Ambulance', number: '1122'},
    {name: 'Fire', number: '16'},
  ],
  Palau: [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '911'},
  ],
  Panama: [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '911'},
  ],
  'Papua New Guinea': [
    {name: 'Police', number: '000'},
    {name: 'Ambulance', number: '111'},
    {name: 'Fire', number: '110'},
  ],
  Paraguay: [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '911'},
  ],
  Peru: [
    {name: 'Police', number: '105'},
    {name: 'Ambulance', number: '106'},
    {name: 'Fire', number: '116'},
  ],
  Philippines: [
    {name: 'Police', number: '117'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '116'},
  ],
  Poland: [
    {name: 'Police', number: '997'},
    {name: 'Ambulance', number: '999'},
    {name: 'Fire', number: '998'},
    {name: 'Emergency', number: '112'},
  ],
  Portugal: [
    {name: 'Police', number: '112'},
    {name: 'Ambulance', number: '112'},
    {name: 'Fire', number: '112'},
  ],
  Qatar: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '999'},
    {name: 'Fire', number: '999'},
  ],
  Romania: [
    {name: 'Police', number: '955'},
    {name: 'Ambulance', number: '961'},
    {name: 'Fire', number: '981'},
    {name: 'Emergency', number: '112'},
  ],
  Russia: [
    {name: 'Police', number: '102'},
    {name: 'Ambulance', number: '103'},
    {name: 'Fire', number: '101'},
  ],
  Rwanda: [
    {name: 'Police', number: '112'},
    {name: 'Ambulance', number: '912'},
    {name: 'Fire', number: '111'},
  ],
  'Saint Kitts and Nevis': [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '333'},
  ],
  'Saint Lucia': [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '911'},
  ],
  'Saint Vincent and the Grenadines': [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '911'},
  ],
  Samoa: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '996'},
    {name: 'Fire', number: '994'},
  ],
  'San Marino': [
    {name: 'Police', number: '113'},
    {name: 'Ambulance', number: '118'},
    {name: 'Fire', number: '115'},
  ],
  'Sao Tome and Principe': [
    {name: 'Police', number: '112'},
    {name: 'Ambulance', number: '112'},
    {name: 'Fire', number: '112'},
  ],
  'Saudi Arabia': [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '997'},
    {name: 'Fire', number: '998'},
  ],
  Senegal: [
    {name: 'Police', number: '17'},
    {name: 'Ambulance', number: '15'},
    {name: 'Fire', number: '18'},
  ],
  Serbia: [
    {name: 'Police', number: '192'},
    {name: 'Ambulance', number: '194'},
    {name: 'Fire', number: '193'},
  ],
  Seychelles: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '151'},
    {name: 'Fire', number: '999'},
  ],
  'Sierra Leone': [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '999'},
    {name: 'Fire', number: '999'},
  ],
  Singapore: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '995'},
    {name: 'Fire', number: '995'},
  ],
  Slovakia: [
    {name: 'Police', number: '158'},
    {name: 'Ambulance', number: '155'},
    {name: 'Fire', number: '150'},
    {name: 'Emergency', number: '112'},
  ],
  Slovenia: [
    {name: 'Police', number: '113'},
    {name: 'Ambulance', number: '112'},
    {name: 'Fire', number: '112'},
    {name: 'Emergency', number: '112'},
  ],
  'Solomon Islands': [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '988'},
  ],
  Somalia: [
    {name: 'Police', number: '888'},
    {name: 'Ambulance', number: '999'},
    {name: 'Fire', number: '555'},
  ],
  'South Africa': [
    {name: 'Police', number: '10111'},
    {name: 'Ambulance', number: '10177'},
    {name: 'Fire', number: '10177'},
  ],
  'South Korea': [
    {name: 'Police', number: '112'},
    {name: 'Ambulance', number: '119'},
    {name: 'Fire', number: '119'},
  ],
  'South Sudan': [
    {name: 'Police', number: '777'},
    {name: 'Ambulance', number: '997'},
    {name: 'Fire', number: '998'},
  ],
  Spain: [
    {name: 'Police', number: '091'},
    {name: 'Ambulance', number: '061'},
    {name: 'Fire', number: '080'},
    {name: 'Emergency', number: '112'},
  ],
  'Sri Lanka': [
    {name: 'Police', number: '119'},
    {name: 'Ambulance', number: '1990'},
    {name: 'Fire', number: '110'},
  ],
  Sudan: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '999'},
    {name: 'Fire', number: '998'},
  ],
  Suriname: [
    {name: 'Police', number: '115'},
    {name: 'Ambulance', number: '113'},
    {name: 'Fire', number: '110'},
  ],
  Sweden: [{name: 'Police/Ambulance/Fire', number: '112'}],
  Switzerland: [
    {name: 'Police', number: '117'},
    {name: 'Ambulance', number: '144'},
    {name: 'Fire', number: '118'},
  ],
  Syria: [
    {name: 'Police', number: '112'},
    {name: 'Ambulance', number: '110'},
    {name: 'Fire', number: '113'},
  ],
  Taiwan: [
    {name: 'Police', number: '110'},
    {name: 'Ambulance', number: '119'},
    {name: 'Fire', number: '119'},
  ],
  Tajikistan: [
    {name: 'Police', number: '102'},
    {name: 'Ambulance', number: '103'},
    {name: 'Fire', number: '101'},
  ],
  Tanzania: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '114'},
    {name: 'Fire', number: '115'},
  ],
  Thailand: [
    {name: 'Police', number: '191'},
    {name: 'Ambulance', number: '1669'},
    {name: 'Fire', number: '199'},
  ],
  'Timor-Leste': [
    {name: 'Police', number: '112'},
    {name: 'Ambulance', number: '110'},
    {name: 'Fire', number: '115'},
  ],
  Togo: [
    {name: 'Police', number: '117'},
    {name: 'Ambulance', number: '8200'},
    {name: 'Fire', number: '118'},
  ],
  Tonga: [
    {name: 'Police', number: '922'},
    {name: 'Ambulance', number: '933'},
    {name: 'Fire', number: '999'},
  ],
  'Trinidad and Tobago': [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '990'},
    {name: 'Fire', number: '990'},
  ],
  Tunisia: [
    {name: 'Police', number: '197'},
    {name: 'Ambulance', number: '190'},
    {name: 'Fire', number: '198'},
  ],
  Turkey: [
    {name: 'Police', number: '155'},
    {name: 'Ambulance', number: '112'},
    {name: 'Fire', number: '110'},
  ],
  Turkmenistan: [
    {name: 'Police', number: '02'},
    {name: 'Ambulance', number: '03'},
    {name: 'Fire', number: '01'},
  ],
  Tuvalu: [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '911'},
  ],
  Uganda: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '911'},
    {name: 'Fire', number: '999'},
  ],
  Ukraine: [
    {name: 'Police', number: '102'},
    {name: 'Ambulance', number: '103'},
    {name: 'Fire', number: '101'},
  ],
  'United Arab Emirates': [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '998'},
    {name: 'Fire', number: '997'},
  ],
  'United Kingdom': [
    {name: 'Police/Ambulance/Fire', number: '999'},
    {name: 'NHS Direct', number: '111'},
    {name: 'Samaritans', number: '116123'},
    {name: 'Emergency', number: '112'},
  ],
  'United States': [
    {name: 'Police/Medical/Fire', number: '911'},
    {name: 'Poison Control', number: '1-800-222-1222'},
    {name: 'National Suicide Prevention', number: '988'},
    {name: 'Crisis Text Line', number: 'Text HOME to 741741'},
  ],
  Uruguay: [
    {name: 'Police', number: '911'},
    {name: 'Ambulance', number: '105'},
    {name: 'Fire', number: '104'},
  ],
  Uzbekistan: [
    {name: 'Police', number: '102'},
    {name: 'Ambulance', number: '103'},
    {name: 'Fire', number: '101'},
  ],
  Vanuatu: [
    {name: 'Police', number: '111'},
    {name: 'Ambulance', number: '112'},
    {name: 'Fire', number: '113'},
  ],
  'Vatican City': [
    {name: 'Police', number: '113'},
    {name: 'Ambulance', number: '118'},
    {name: 'Fire', number: '115'},
  ],
  Venezuela: [
    {name: 'Police', number: '171'},
    {name: 'Ambulance', number: '171'},
    {name: 'Fire', number: '171'},
  ],
  Vietnam: [
    {name: 'Police', number: '113'},
    {name: 'Ambulance', number: '115'},
    {name: 'Fire', number: '114'},
  ],
  Yemen: [
    {name: 'Police', number: '194'},
    {name: 'Ambulance', number: '191'},
    {name: 'Fire', number: '191'},
  ],
  Zambia: [
    {name: 'Police', number: '999'},
    {name: 'Ambulance', number: '992'},
    {name: 'Fire', number: '993'},
  ],
  Zimbabwe: [
    {name: 'Police', number: '995'},
    {name: 'Ambulance', number: '994'},
    {name: 'Fire', number: '993'},
  ],
};

export const countryList = Object.keys(SOS_NUMBERS).sort();

// This is now a pure data provider component that doesn't render anything
const SOSContacts = () => {
  return null;
};

export default SOSContacts;
