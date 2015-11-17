'use strict';

let assert = require('assert');
let gerarcpf = require('gerar-cpf');
let config = require('../config.json');
let Epp = require('../');
let epp = new Epp(config);

let number = gerarcpf('xxx.xxx.xxx-xx');

describe('Registrobr', () => {
  let client_id;

  describe('Hello', () => {
    it('#hello()', (done) => {
        epp
          .hello()
          .then((data) => {
            assert.ok(!!data);
            done();
          })
          .catch((err) => {
            assert.ok(false);
            done();
          })
    });
  });

  describe('Connection Start', () => {
    it('#login()', (done) => {
        epp
          .login()
          .then((data) => {
            assert.ok(!!data);
            done();
          })
          .catch((err) => {
            assert.ok(false);
            done();
          })
    });
  });

  describe('Contact', () => {
    it('#contact_create()', (done) => {
        epp
          .contact_create({
            client_name: 'José da Silva Jr. Testeasd',
            client_street_1: 'Rua das Laranjeiras',
            client_street_2: '100',
            client_city: 'São Paulo',
            client_state: 'SP',
            client_zipcode: '02127-000',
            client_country: 'BR',
            client_phone: '+55.1122222222',
            client_email: 'teste@teste.com'
          }).then((data) => {
            client_id = data.client_id
            assert.ok(!!client_id);
            done();
          }).catch((data) => {
            assert.ok(false);
            done();
          });
    });

    it('#contact_info()', (done) => {
        epp
          .contact_info(client_id)
          .then((data) => {
            assert.ok(!!data);
            done();
          })
          .catch((err) => {
            assert.ok(false);
            done();
          })
    });

    it('#contact_update()', (done) => {
        epp
          .contact_update({
            client_id: client_id,
            client_name: 'José da Silva Jr. asdaasda',
            client_street_1: 'Rua das Laranjeiras',
            client_street_2: '100',
            client_city: 'São Paulo',
            client_state: 'SP',
            client_zipcode: '02127-000',
            client_country: 'BR',
            client_phone: '+55.1122222222',
            client_email: 'teste@teste.com'
          }).then((data) => {
            assert.ok(!!data);
            done();
          }).catch((data) => {
            assert.ok(false);
            done();
          });
    });
  });
  
  describe('Organization', () => {
    it('#org_create()', (done) => {
        epp
          .org_create({
            org_id: number,
            org_name: 'José da Silva',
            org_street_1: 'Rua das Figueiras',
            org_street_2: '200',
            org_city: 'São Paulo',
            org_state: 'SP',
            org_zipcode: '01311-100',
            org_country: 'BR',
            org_phone: '+55.1133333333',
            org_email: 'teste@teste.com.br',
            contact_id: client_id,
            contact_name: 'José da Silva'
          })
          .then((data) => {
            assert.equal(number, data.org_id);
            done();
          })
          .catch((err) => {
            assert.ok(false);
            done();
          })
    });

   
    it('#org_info()', (done) => {
        epp
          .org_info(number)
          .then((data) => {
            assert.equal(number, data.org_id);
            done();
          })
          .catch((err) => {
            assert.ok(true);
            done();
          })
    });

    it('#org_check()', (done) => {
        epp
          .org_check(number)
          .then((data) => {
            assert.equal(number, data.org_id);
            done();
          })
          .catch((err) => {
            assert.ok(false);
            done();
          })
    });

    it('#org_update()', (done) => {
        epp
          .org_update({
            org_id: number,
            org_street_1: 'Rua das Laranjeiras',
            org_street_2: '300',
            org_city: 'São Paulo',
            org_state: 'SP',
            org_zipcode: '04209-004',
            org_country: 'BR',
            org_phone: '+55.1144444444',
            contact_id: client_id,
            contact_name: 'José da Silva Moraes'
          })
          .then((data) => {
            assert.equal(number, data.org_id);
            done();
          })
          .catch((err) => {
            assert.ok(true);
            done();
          })
    });
  });


  describe('Domain', () => {
    let domain = 'asduhasudhas.com.br';

    it('#domain_check()', (done) => {
        epp
          .domain_check(domain)
          .then((data) => {
            assert.ok(!!data);
            done();
          })
          .catch((err) => {
            assert.ok(false);
            done();
          })
    });
   
    it('#domain_create()', (done) => {
        epp
          .domain_create({
            domain_name: domain,
            domain_period: 1,
            dns_1: 'ns1.yoursite-idc.net',
            dns_2: 'ns2.yoursite-idc.net',
            org_id: number,
            auto_renew: 0
          })
          .then((data) => {
            assert.ok(!!data);
            done();
          })
          .catch((err) => {
            assert.ok(false);
            done();
          })
    });

    it('#domain_update()',
      (done) => {
        epp
          .domain_update({
            ticket_number: '',
            domain_name: domain,
            dns_1:  'ns1.yoursite-idc.net',
            dns_2: 'ns2.yoursite-idc.net',
            client_id: number,
            org_id: number,
            auto_renew: 0
          })
          .then((data) => {
            assert.ok(!!data);
            done();
          })
          .catch((err) => {
            assert.ok(true);
            done();
          })
    });

    it('#domain_info()',
      (done) => {
        epp
          .domain_info('google.com.br')
          .then((data) => {
            assert.ok(!!data);
            done();
          })
          .catch((err) => {
            assert.ok(false);
            done();
          })
    });

    it('#domain_renew()',
      (done) => {
        epp
          .domain_renew(domain, 1)
          .then((data) => {
            assert.ok(!!data);
            done();
          })
          .catch((err) => {
            assert.ok(!!err);
            done();
          })
    });

    it('#domain_delete()',
      (done) => {
        epp
          .domain_delete(domain)
          .then((data) => {
            assert.ok(!!data);
            done();
          })
          .catch((err) => {
            assert.ok(!!err);
            done();
          })
    });
  });

  describe('Poll', () => {
    let poll_id;

    it('#poll_request()', (done) => {
        epp
          .poll_request()
          .then((data) => {
            poll_id = data.msg_id;
            assert.ok(!!data);
            done();
          })
          .catch((err) => {
            assert.ok(false);
            done();
          })
    });
   
    it('#poll_delete()', (done) => {
        epp
          .poll_delete(poll_id)
          .then((data) => {
            assert.ok(!!data);
            done();
          })
          .catch((err) => {
            assert.ok(false);
            done();
          })
    });
  });

  describe('Connection End', () => {
    it('#logout()', (done) => {
        epp
          .logout()
          .then((data) => {
            assert.ok(!!data);
            done();
          })
          .catch((err) => {
            assert.ok(false);
            done();
          })
    });
  });

  describe('Change Password', () => {
    it('#login()', (done) => {
        epp
          .login('NOVASENHA')
          .then((data) => {
            assert.ok(!!data);
            epp.logout();
            done();
          })
          .catch((err) => {
            assert.ok(!!err);
            epp.logout();
            done();
          })
    });
  });
});