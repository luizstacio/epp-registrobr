'use strict';

console.log('\n\n\n\n\n\n\n\n-------------------------------------------------------------------------------------------------------\n\n');

console.log('Inical date: ', new Date());

let Util = require('../lib/util');
let Epp = require('../');
let gerarcpf = require('gerar-cpf');
let config = require('../config.homologation.json');
let cpf = gerarcpf('xxx.xxx.xxx-xx');
let domain1 = config.domain_1;
let domain2 = config.domain_2;
let newPassword =  config.newpassword;

console.log(cpf, domain1, domain2);

function createCallback(promise, name) {
  promise.then((data) => {
    console.log(name, ': ', data);
  }).catch((data) => {
    console.log(name, ': ', data);
  })
}

function handlerError(err) {
  console.log('error: ', err);
  connection.logout();
}

//**
//* Connect
//*
let connection = new Epp(config);

//**
//* Nova senha
//*
createCallback(connection.login(newPassword), 'login com troca de senha');

//**
//* Hello
//*
createCallback(connection.hello(), 'hello');

//**
//* Hello
//*
createCallback(connection.logout(), 'logout');

//**
//* Connect
//*
config.password = config.newpassword;
connection = new Epp(config);

let id_contact;

//**
//* Login com nova senha
//*
connection.login().then(() => {
  
  console.log('Login com nova senha');

  if ( !process.env.CLIENT ) {


    console.log('\n>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n ComandosContato \n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>\n');
    ComandosContato().then((client_id) => {
      
      console.log('\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n\n\n\n\n');
      
      console.log('\n>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n ComandosOrganizacao \n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>\n');
      ComandosOrganizacao(client_id).then((org_id) => {
        
        console.log('\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n\n\n\n\n');
      
        console.log('\n>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n ComandosDominio \n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>\n');
        ComandosDominio(org_id).then((ticket) => {

          console.log('\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n\n\n\n\n');

          console.log('\n>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n ComandosDominio2 \n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>\n');
          ComandosDominio2(org_id).then((data) => {
            
            console.log('\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n\n\n\n\n');

            console.log('\n>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n ComandosMessageria \n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>\n');
            ComandosMessageria().then((data) => {

              
              console.log('\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n\n\n\n\n');
              
              console.log('\n\n\n\n//////////////////////////////////////\n');
              console.log('  Dominio: ', domain1);
              console.log('  Org: ', cpf);
              console.log('  Ticket: ', ticket);
              console.log('  Client Id: ', client_id);
              console.log('  Aguarde de 10~20minutos e execute o comando "CLIENT='+ cpf +' node homologation/index.js >> log.txt\n"');
              console.log('//////////////////////////////////////\n\n');

              connection.logout();
            }).catch(handlerError);
          }).catch(handlerError);
        }).catch(handlerError);
      }).catch(handlerError);
    }).catch(handlerError);
    
  }  else {

    connection.domain_info(domain1).then((data) => {

      console.log('\n>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n ComandosUpdateOrganizacao \n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>\n');
      ComandosUpdateOrganizacao(process.env.CLIENT).then(() => {

        console.log('\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n\n\n\n\n');

        console.log('\n>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n ComandosUpdateDomain \n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>\n');
        ComandosUpdateDomain().then(() => {

          console.log('End date: ', new Date(), '\n\n\n');
          console.log('\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n\n\n\n\n');
          connection.logout();

        }).catch(handlerError);
      }).catch(handlerError);
    }).catch(function (data) {
      console.log(data);
      console.log('\n>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n Dominio não publicado, arguarde. \n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>\n');
      connection.logout();
    });
  }



}).catch(handlerError);

//**
//* Comandos update de dominio
//*
function ComandosUpdateDomain () {
  var defer = Promise.defer();
  var domain = domain1;

  function handlerError(err) {
    console.log('error: ', err);
    defer.reject(err);
  }

  connection.domain_info(domain).then((data) => {

    console.log('Dominio info ', data);

    connection.domain_renew(domain, 1).then((data) => {

      console.log('Dominio renovação ', data);

      connection.contact_create({
        client_name: 'João da silva',
        client_street_1: 'Rua dr joão',
        client_street_2: '200',
        client_city: 'Florianopolis',
        client_state: 'SC',
        client_zipcode: '88802-240',
        client_country: 'BR',
        client_phone: '+55.4899332211',
        client_email: 'joaodasilva@gmail.com.br'
      }).then((contact) => {

        console.log('Contato criado', contact);

        connection.domain_update({
          domain_name: domain,
          client_id: contact.client_id
        }).then((data) => {

          console.log('Dominio update contato', data);

           connection.domain_update({
            domain_name: domain,
            auto_renew: 1
          }).then((data) => {

            console.log('Domain habilitar auto renew', data);

            connection.domain_update({
              domain_name: domain,
              auto_renew: 0
            }).then((data) => {

              console.log('Domain desabilitar auto renew', data);

              connection.domain_delete(domain2).then((data) => {

                console.log('Domain deleted', data);

                defer.resolve();

              }).catch(handlerError);
            }).catch(handlerError);
          }).catch(handlerError);
        }).catch(handlerError);
      }).catch(handlerError);
    }).catch(handlerError);
  }).catch(handlerError);

  return defer.promise;
} 

//**
//* Comandos update de organizacao
//*
function  ComandosUpdateOrganizacao(cpf) {
  var defer = Promise.defer();

  function handlerError(err) {
    console.log('error: ', err);
    defer.reject(err);
  }

  connection.org_update({
    org_id: cpf,
    org_street_1: 'Rua pre historica alterada',
    org_street_2: '250',
    org_phone: '+55.4899998888'
  }).then((data) => {

    console.log('Organizacao alterada');

    connection.org_info(cpf).then((data) => {

      console.log('Organizacao info ', data);

      defer.resolve(data);
    }).catch(handlerError);
  }).catch(handlerError);

  return defer.promise;
}

//**
//* Comandos de menssageria
//*
function ComandosMessageria () {
  var defer = Promise.defer();

  function handlerError(err) {
    console.log('error: ', err);
    defer.reject(err);
  }

  connection.poll_request().then((data) => {

    console.log('Create poll: ', data);

    connection.poll_delete(data.msg_id).then(() => {
    
      console.log('Delete poll: ', data.msg_id);

      defer.resolve(data);
    }).catch(handlerError);
  }).catch(handlerError);

  return defer.promise;
}

function ComandosDominio2 (org_id) {
  var defer = Promise.defer();
  var domain = domain2;

  function handlerError(err) {
    console.log('error: ', err);
    defer.reject(err);
  }

  connection.domain_check(domain).then((data) => {
    console.log('Dominio livre: ', !!data.domain_available);

    if (data.domain_available) {
      connection.domain_create({
        domain_name: domain,
        domain_period: 1,
        dns_1: config.dns_1,
        dns_2: config.dns_2,
        dns_2_v4: config.dns_2_v4,
        dns_3: config.dns_3,
        dns_3_v4: config.dns_3_v4,
        dns_3_v6: config.dns_3_v6,
        org_id: org_id,
        auto_renew: 0
      }).then((data) => {
        
        console.log('Dominio2 create: ', data);

        defer.resolve(data);

      }).catch(handlerError);
    }
  }).catch(handlerError);

  return defer.promise;
}

//**
//* Comandos de dominio
//*
function ComandosDominio (org_id) {
  var defer = Promise.defer();
  var domain = domain1;

  function handlerError(err) {
    console.log('error: ', err);
    defer.reject(err);
  }

  connection.domain_check(domain).then((data) => {

    console.log('Dominio check ', data);

    connection.domain_create({
      domain_name: domain,
      domain_period: 1,
      dns_1: config.dns_1,
      dns_2: config.dns_2,
      dns_2_v4: config.dns_2_v4,
      dns_3: config.dns_3,
      dns_3_v4: config.dns_3_v4,
      dns_3_v6: config.dns_3_v6,
      org_id: org_id,
      auto_renew: 0
    }).then((data) => {
      
      console.log('Dominio create: ', data);

      connection.domain_info(domain, data.domain_ticket).then((data) => {
        var ticket = data.domain_ticket;

        console.log('Tiket info ', ticket, ': ', data);

        connection.domain_update({
          domain_name: domain,
          domain_ticket: ticket,
          dns_1:  config.dns_1,
          dns_2: config.dns_2
        }).then((data) => {

          console.log('Ticket update', ticket, ': ', data);

           defer.resolve(ticket);
        }).catch(handlerError);
      }).catch(handlerError);
    }).catch(handlerError);
  }).catch(handlerError);

  return defer.promise;
}

//**
//* Comandos de organizacao
//*
function ComandosOrganizacao (client_id) {
  var defer = Promise.defer();

  function handlerError(err) {
    console.log('error: ', err);
    defer.reject(err);
  }

  connection.org_check(cpf).then((data) => {
    
    console.log('Organizacao check: ', data);

    connection.org_create({
      org_id: cpf,
      org_name: 'Silva Sauro Org.',
      org_street_1: 'Rua pre historica',
      org_street_2: '200',
      org_city: 'São Paulo',
      org_state: 'SP',
      org_zipcode: '01311-100',
      org_country: 'BR',
      org_phone: '+55.118888888',
      org_email: 'contato@silvasaurosolutions.com.br',
      contact_id: client_id,
      contact_name: 'Orlando'
    }).then((data) => {
      let org_id = data.org_id;

      console.log('Organizacao create: ', data);

      connection.org_info(org_id).then((data) => {

        console.log('Organizacao info', data);
        defer.resolve(org_id);
      }).catch(handlerError);
    }).catch(handlerError);
  }).catch(handlerError);

  return defer.promise;
}

//**
//* Comandos de contato
//*
function ComandosContato() {
  var defer = Promise.defer();

  function handlerError(err) {
    console.log('error: ', err);
    defer.reject(err);
  }

  connection.contact_create({
    client_name: 'Orlando da Silva',
    client_street_1: 'Rua pedro joão',
    client_street_2: '100',
    client_city: 'Criciuma',
    client_state: 'SC',
    client_zipcode: '88802-240',
    client_country: 'BR',
    client_phone: '+55.4899887766',
    client_email: 'contato2@orlandodasilva.com.br'
  }).then((contact) => {
    
    console.log('Contato create: ', contact);
    
    connection.contact_info(contact.client_id).then((data) => {

      console.log('Contato info: ', data);
    
      connection.contact_update({
        client_id: contact.client_id,
        client_name: 'Orlando da Silva Sauro',
        client_street_1: 'Rua pedro joão onde mora o sauro',
        client_street_2: '100',
        client_city: 'Criciuma',
        client_state: 'SC',
        client_zipcode: '88802-240',
        client_country: 'BR',
        client_phone: '+55.4899887766',
        client_email: 'contato2@orlandodasilva.com.br'
      }).then((data) => {

        console.log('Contato update: ', data);
        defer.resolve(contact.client_id);

      }).catch(handlerError);
    }).catch(handlerError);
  }).catch(handlerError);

  return defer.promise;
}