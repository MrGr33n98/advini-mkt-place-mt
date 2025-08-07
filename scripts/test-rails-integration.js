#!/usr/bin/env node

/**
 * Script de teste para verificar a integração Rails-Frontend
 * 
 * Este script testa:
 * 1. Conectividade com o Rails API
 * 2. Endpoints de posts, users, comments
 * 3. Autenticação via token
 * 4. Respostas JSON válidas
 */

const https = require('https');
const http = require('http');

// Configurações
const RAILS_BASE_URL = 'http://localhost:3001';
const API_BASE_URL = `${RAILS_BASE_URL}/api/v1`;
const ADMIN_API_TOKEN = 'development-admin-token';

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Token': ADMIN_API_TOKEN,
        ...options.headers
      }
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
            parseError: error.message
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function testEndpoint(name, url, expectedStatus = 200) {
  try {
    log(`\n🧪 Testando: ${name}`, 'blue');
    log(`   URL: ${url}`, 'yellow');
    
    const response = await makeRequest(url);
    
    if (response.status === expectedStatus) {
      log(`   ✅ Status: ${response.status} (esperado: ${expectedStatus})`, 'green');
      
      if (response.data && typeof response.data === 'object') {
        log(`   ✅ JSON válido recebido`, 'green');
        
        // Log de informações específicas baseadas no endpoint
        if (url.includes('/posts')) {
          const posts = response.data.posts || [];
          log(`   📝 Posts encontrados: ${posts.length}`, 'blue');
          if (response.data.meta) {
            log(`   📊 Total: ${response.data.meta.total_count}, Páginas: ${response.data.meta.total_pages}`, 'blue');
          }
        } else if (url.includes('/users')) {
          const users = response.data.users || [];
          log(`   👥 Usuários encontrados: ${users.length}`, 'blue');
          if (response.data.meta) {
            log(`   📊 Total: ${response.data.meta.total_count}, Páginas: ${response.data.meta.total_pages}`, 'blue');
          }
        } else if (url.includes('/comments')) {
          const comments = response.data.comments || [];
          log(`   💬 Comentários encontrados: ${comments.length}`, 'blue');
        }
        
        return { success: true, data: response.data };
      } else {
        log(`   ⚠️  Resposta não é JSON válido`, 'yellow');
        return { success: false, error: 'Invalid JSON response' };
      }
    } else {
      log(`   ❌ Status: ${response.status} (esperado: ${expectedStatus})`, 'red');
      log(`   📄 Resposta: ${JSON.stringify(response.data, null, 2)}`, 'red');
      return { success: false, error: `Unexpected status: ${response.status}` };
    }
  } catch (error) {
    log(`   ❌ Erro: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function testCORS() {
  try {
    log(`\n🌐 Testando CORS`, 'blue');
    
    const response = await makeRequest(`${API_BASE_URL}/posts`, {
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, X-API-Token'
      }
    });
    
    const corsHeaders = response.headers['access-control-allow-origin'];
    if (corsHeaders) {
      log(`   ✅ CORS configurado: ${corsHeaders}`, 'green');
      return { success: true };
    } else {
      log(`   ⚠️  Headers CORS não encontrados`, 'yellow');
      return { success: false, error: 'CORS headers not found' };
    }
  } catch (error) {
    log(`   ❌ Erro CORS: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log(`${colors.bold}🚀 Iniciando testes de integração Rails-Frontend${colors.reset}`, 'blue');
  log(`${colors.bold}================================================${colors.reset}`, 'blue');
  
  const results = [];
  
  // Teste de conectividade básica
  results.push(await testEndpoint(
    'Conectividade Rails',
    `${RAILS_BASE_URL}`,
    200
  ));
  
  // Teste de endpoints da API
  results.push(await testEndpoint(
    'API Posts - Listagem',
    `${API_BASE_URL}/posts`
  ));
  
  results.push(await testEndpoint(
    'API Users - Listagem',
    `${API_BASE_URL}/users`
  ));
  
  results.push(await testEndpoint(
    'API Posts - Paginação',
    `${API_BASE_URL}/posts?page=1&per_page=5`
  ));
  
  results.push(await testEndpoint(
    'API Users - Paginação',
    `${API_BASE_URL}/users?page=1&per_page=5`
  ));
  
  // Teste CORS
  results.push(await testCORS());
  
  // Teste de autenticação (endpoint que deveria falhar sem token)
  try {
    log(`\n🔐 Testando autenticação (sem token)`, 'blue');
    const response = await makeRequest(`${API_BASE_URL}/posts`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        // Sem X-API-Token
      }
    });
    
    if (response.status === 401 || response.status === 403) {
      log(`   ✅ Autenticação funcionando (rejeitou sem token)`, 'green');
      results.push({ success: true });
    } else {
      log(`   ⚠️  Endpoint não protegido (status: ${response.status})`, 'yellow');
      results.push({ success: false, error: 'Endpoint not protected' });
    }
  } catch (error) {
    log(`   ❌ Erro no teste de autenticação: ${error.message}`, 'red');
    results.push({ success: false, error: error.message });
  }
  
  // Resumo dos resultados
  log(`\n${colors.bold}📊 Resumo dos Testes${colors.reset}`, 'blue');
  log(`${colors.bold}==================${colors.reset}`, 'blue');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  if (successful === total) {
    log(`✅ Todos os testes passaram! (${successful}/${total})`, 'green');
    log(`\n🎉 Integração Rails-Frontend está funcionando corretamente!`, 'green');
    log(`\n📋 Próximos passos:`, 'blue');
    log(`   1. Inicie o Rails: cd backend/noticed_v2 && rails server -p 3001`, 'yellow');
    log(`   2. Inicie o Next.js: npm run dev`, 'yellow');
    log(`   3. Acesse: http://localhost:3000/rails-posts`, 'yellow');
    log(`   4. Acesse: http://localhost:3000/rails-users`, 'yellow');
  } else {
    log(`❌ ${total - successful} teste(s) falharam (${successful}/${total} passaram)`, 'red');
    log(`\n🔧 Verifique:`, 'yellow');
    log(`   1. Rails está rodando em http://localhost:3001`, 'yellow');
    log(`   2. Gems rack-cors e dotenv-rails estão instaladas`, 'yellow');
    log(`   3. Arquivo .env.local está configurado`, 'yellow');
    log(`   4. CORS está configurado corretamente`, 'yellow');
  }
  
  process.exit(successful === total ? 0 : 1);
}

// Executar testes
runTests().catch(error => {
  log(`\n💥 Erro fatal: ${error.message}`, 'red');
  process.exit(1);
});