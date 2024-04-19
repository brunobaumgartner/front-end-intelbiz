var links = {
    busca_produtos: 'http://127.0.0.1:5000/produto',
    busca_produto: 'http://127.0.0.1:5000/produto/?nome=',
    delete_produto: 'http://127.0.0.1:5000/produto?nome=',
    insert_produto_base: 'http://127.0.0.1:5000/produto',
    atualiza_produto_base: 'http://127.0.0.1:5000/produto',
    busca_clientes: 'http://127.0.0.1:5000/cliente',
    busca_cliente: 'http://127.0.0.1:5000/cliente/?nome=',
    delete_cliente: 'http://127.0.0.1:5000/cliente?id=',
    insert_cliente_base: 'http://127.0.0.1:5000/cliente/',
    busca_proxima_venda: 'http://127.0.0.1:5000/ultima-venda',
    busca_vendas: 'http://127.0.0.1:5000/venda/?cliente_id=',
    insert_venda_base: 'http://127.0.0.1:5000/venda'
}

function limpa_tela() {
    var tableHead = document.getElementById("thead");
    tableHead.innerHTML = "";
    var tableBody = document.getElementById("tbody");
    tableBody.innerHTML = "";
    var section = document.querySelector("header section");
    section.innerHTML = "";
    document.getElementById("btn_vendas").style.backgroundColor = '#FFFFFF'
    document.getElementById("btn_produtos").style.backgroundColor = '#FFFFFF'
    document.getElementById("btn_clientes").style.backgroundColor = '#FFFFFF'
}

function seleciona_botao(id) {
    document.getElementById(id).style.backgroundColor = '#A4DEFF'
}

function selecino_painel(painel1, painel2, element_id) {
    var painel = document.getElementById(element_id);
    if (painel.checked) {
        painel1()
    } else {
        painel2()
    }
}

async function add_carrinho() {
    var sel_produto = document.getElementById("sel_produto");
    var txt_produto_selecionado = sel_produto.options[sel_produto.selectedIndex];
    var sel_cliente = document.getElementById("sel_cliente");
    var txt_cliente_selecionado = sel_cliente.options[sel_cliente.selectedIndex];
    var input_quantidade = document.getElementById("quantidade_produto");
    var valor_produto = document.getElementById("valor_produto");
    

    var contador = localStorage.getItem('contador');
    contador = (!contador) ? 1 : parseInt(contador) + 1;
    localStorage.setItem('contador', contador);
    busca_proxima_venda().then((dado) => {
    localStorage.setItem('contador', contador);
        const carrinho = { 'id': contador,
                           'id_venda': dado, 
                           'nome_produto': txt_produto_selecionado.textContent, 
                           'id_produto': txt_produto_selecionado.getAttribute('id_produto'),
                           'nome_cliente': txt_cliente_selecionado.textContent, 
                           'id_cliente': sel_cliente.value,
                           'quantidade': input_quantidade.value,
                           'valor_produto': txt_produto_selecionado.value,
                           'valor_total': valor_produto.value
                        };
        localStorage.setItem(contador, JSON.stringify(carrinho));
    }).then(()=>{
        popula_total();
        popula_table_vendas();
    })
}

function delete_venda(id) {
    if (confirm('Deseja excluir o cliente?')) {
        localStorage.removeItem(id)
    }
    popula_table_vendas();
}

function popula_total() {
    var valor_pagar = document.getElementById("valor_pagar");
    var valor_storage = 0;
    get_carrinho().then((valor_total)=>{
        valor_total.forEach(item => {
            valor_storage += parseFloat(item.valor_total);
        });
        valor_pagar.value = valor_storage;
    })
}

async function get_carrinho() {
    contador = localStorage.getItem('contador');

    var produto =[];
    for (let i = 1; i <= localStorage.length - 1; i++) {
        let chave = localStorage.key(i);
        produto[chave] = JSON.parse(localStorage.getItem(chave));
    }
     return produto;
}

function insert_carrinho_base() {
    var produto= [];
    for (let i = 1; i <= localStorage.length - 1; i++) {
        let chave = localStorage.key(i);
        produto[chave] = JSON.parse(localStorage.getItem(chave));
    }
    console.log(produto)
    produto.forEach(item => {
        if (item.id_venda == null) {
            item.id_venda = 1
        }
        insert_venda_base(item.id_cliente, item.id_produto, item.quantidade, item.id_venda);
    });

    localStorage.clear();
    popula_table_vendas();
}

/* Tela de vendas */
painel_venda();
function painel_venda() {
    limpa_tela();
    seleciona_botao("btn_vendas")
    busca_produtos()
    .then((dados_produto) =>{
        produtos  = dados_produto
        busca_clientes()
        .then((dados_cliente) => {
            clientes  = dados_cliente
            var section = document.querySelector("header section");
            section.innerHTML = `<div id="painel">
                                <label for="Cliente">Cliente
                                    <select name="Cliente" id="sel_cliente">
                                        <option>Selecione</option>
                                    </select>
                                </label>
                                <label for="Produto">Produto
                                    <select name="Produto" id="sel_produto">
                                        <option>Selecione</option>
                                    </select>
                                </label>
                                <label for="Quantidade">Quantidade
                                    <input type="text" name="Quantidade" id="quantidade_produto">
                                </label>
                                <label for="Valor">Valor
                                    <input type="text" name="Valor" id="valor_produto" disabled>
                                </label>
                            </div>
                            <label class="switch">
                            <span class="slider"></span>
                                <input type="checkbox" id='sel_painel' onclick="selecino_painel(painel_venda_busca, 
                                                                                painel_venda, 
                                                                                'sel_painel')">
                                <span class="slider" data-label="Buscar" data-checked-label="Vender"></span>
                            </label>
                            <div id='valores'>
                                <label for="valor_pago">Valor Pago:
                                    <input type="text" name="valor_pago" id="valor_pago">
                                </label>
                                <label for="valor_pagar" style="margin-left: 20px;">Total:
                                    <input type="text" name="valor_pagar" id="valor_pagar" disabled>
                                </label>
                                <label for="valor_troco" style="margin-left: 20px;">Troco:
                                    <input type="text" name="valor_troco" id="valor_troco" disabled>
                                </label>
                            </div>
                            <div id="btn_acoes">
                                <a href="#" id="btn_adicionar">Adicionar</a>
                                <a href="#" id="btn_concluir">Concluir</a>
                            </div>
                            `;
            popula_table_vendas();
            
            let input_quantidade = document.getElementById("quantidade_produto");
            let sel_produto = document.getElementById("sel_produto");
            let valor_produto = document.getElementById("valor_produto");
            let valor_pago = document.getElementById("valor_pago");
            let valor_pagar = document.getElementById("valor_pagar");
            let valor_troco = document.getElementById("valor_troco");
            let btn_adicionar = document.getElementById("btn_adicionar");
            let btn_concluir = document.getElementById("btn_concluir");
            const select_clientes = document.getElementById("sel_cliente");
            
            produtos.forEach(item => {
                const option = document.createElement('option');
                option.textContent = item.Produto;
                option.value = item.Valor;
                option.setAttribute('id_produto',item.id);
                sel_produto.appendChild(option);
            });

            clientes.forEach(item => {
                const option = document.createElement('option');
                option.textContent = item.nome;
                option.value = item.id;
                select_clientes.appendChild(option);
            });
            
            input_quantidade.addEventListener("change", function() {
                let quantidade_produto = input_quantidade.value;
                valor_produto.value = sel_produto.value * quantidade_produto;
            })

            sel_produto.addEventListener("change", function() {
                let quantidade_produto = input_quantidade.value;
                valor_produto.value = sel_produto.value * quantidade_produto;
            })

            select_clientes.addEventListener("change", function() {
                localStorage.clear();
                popula_table_vendas();
            })

            valor_pago.addEventListener("change", function() {
                valor_troco.value = valor_pago.value - valor_pagar.value;
            })

            btn_adicionar.addEventListener("click", function() {
                add_carrinho()
            })

            btn_concluir.addEventListener("click", function() {
                insert_carrinho_base();
            })
        }).catch(error => {
            console.error('Erro:', error);
        });
    })
}

function painel_venda_busca() {
    limpa_tela();
    seleciona_botao("btn_vendas")
    busca_clientes()
        .then((dados_cliente) => {
            clientes  = dados_cliente
            var section = document.querySelector("header section");
            section.innerHTML = `<div id="painel">
                                    <label for="Cliente">Cliente
                                        <select name="Cliente" id="sel_cliente"></select>
                                    </label>
                                </div>
                                <label class="switch">
                                <span class="slider"></span>
                                    <input type="checkbox"  checked id='sel_painel' onclick="selecino_painel(painel_venda_busca, 
                                                                                    painel_venda, 
                                                                                    'sel_painel')">
                                    <span class="slider" data-label="Buscar" data-checked-label="Vender"></span>
                                </label>
                                <div id="btn_acoes">
                                    <a href="#" id="btn_buscar">Buscar</a>
                                </div>
                        `;
    const select_clientes = document.getElementById("sel_cliente");
    const btn_buscar = document.getElementById("btn_buscar");
    clientes.forEach(item => {
        const option = document.createElement('option');
        option.textContent = item.nome;
        option.value = item.id;
        select_clientes.appendChild(option);
    });

    
    btn_buscar.addEventListener("click", function() {
        localStorage.clear();
        popula_table_venda(select_clientes.value);
    })
    })
}

/* Tela de produtos */
function painel_produto_cadastro() {
    limpa_tela();
    seleciona_botao("btn_produtos")
    popula_table_produto();

    var section = document.querySelector("header section");
    section.innerHTML = `<div id="painel">
                            <label for="Produto">Produto
                                <input type="text" name="Produto" class="bg_text" id="produto_nome">
                            </label>
                            <label for="Quantidade">Quantidade
                                <input type="text" name="Quantidade" id="produto_quantidade">
                            </label>
                            <label for="Valor">Valor
                                <input type="text" name="Valor" id="produto_valor">
                            </label>
                        </div>
                        <label class="switch">
                            <span class="slider"></span>
                            <input type="checkbox"  id='sel_painel' onclick="selecino_painel(painel_produto_busca, painel_produto_cadastro, 'sel_painel')">
                            <span class="slider" data-label="Buscar" data-checked-label="Cadastrar"></span>
                        </label>
                        
                        <div id="btn_acoes">
                            <a href="#" id="btn_atualizar">Atualizar</a>
                            <a href="#" id="btn_adicionar">Adicionar</a>
                        </div>
                        `;

    var btnAdicionar = document.getElementById("btn_atualizar");
    btnAdicionar.addEventListener("click", function() {
        var nome = document.getElementById("produto_nome").value;
        var quantidade = document.getElementById("produto_quantidade").value;
        var valor = document.getElementById("produto_valor").value;
        atualiza_produto_base(nome, quantidade, valor);
    });
    var btnAdicionar = document.getElementById("btn_adicionar");
    btnAdicionar.addEventListener("click", function() {
        var nome = document.getElementById("produto_nome").value;
        var quantidade = document.getElementById("produto_quantidade").value;
        var valor = document.getElementById("produto_valor").value;
        insert_produto_base(nome, quantidade, valor);
    });
}

function painel_produto_busca() {
    limpa_tela();
    seleciona_botao("btn_produtos");
    busca_produtos().then(
        data => {
        var section = document.querySelector("header section");
        section.innerHTML = `<div id="painel">
                                <label for="Produto">Produto
                                    <select name="Produto" id="sel_Produto"></select>
                                </label>
                            </div>
                            <label class="switch">
                                <span class="slider"></span>
                                <input type="checkbox" checked id='sel_painel' onclick = "selecino_painel(painel_produto_busca, painel_produto_cadastro, 'sel_painel')">
                                <span class="slider" data-label="Buscar" data-checked-label="Cadastrar"></span>
                            </label>
                            <div id="btn_acoes">
                                <a href="#"  id="btn_buscar">Buscar</a>
                            </div>`;
        const select = document.getElementById("sel_Produto");
        data.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item.Produto;
            select.appendChild(option);
        });

        var btn_buscar = document.getElementById("btn_buscar");
        btn_buscar.addEventListener("click", function() {
        const select = document.getElementById("sel_Produto");
        const opcao_selecionada = select.options[select.selectedIndex];
        const valor_selecionado = opcao_selecionada.value;
        popula_table_produto_filtrada(valor_selecionado)
    });
    }).catch(error => {
        console.error('Erro:', error);
    });
    
}

/* Tela de clientes */
function painel_cliente_cadastro() {
    limpa_tela();
    popula_table_cliente();
    seleciona_botao("btn_clientes")

    var section = document.querySelector("header section");
    section.innerHTML = `<div id="painel">
                            <label for="Cliente">Cliente
                                <input type="text" name="Cliente" class="bg_text" id="cliente_nome">
                            </label>
                            <label for="Email">Email
                                <input type="text" name="email" class="bg_text" id="cliente_email">
                            </label>
                            <label for="Telefone">Telefone
                                <input type="tel" name="Telefone" id="cliente_telefone" pattern="[0-9]{11}" id="cliente_telefone">
                            </label>
                        </div>
                        <label class="switch">
                            <span class="slider"></span>
                            <input type="checkbox"  id='sel_painel' onclick="selecino_painel(painel_cliente_busca, painel_cliente_cadastro, 'sel_painel')">
                            <span class="slider" data-label="Buscar" data-checked-label="Cadastrar"></span>
                        </label>
                        
                        <div id="btn_acoes">
                            <a href="#" id="btn_adicionar">Adicionar</a>
                        </div>
                        `;
                        
    var btnAdicionar = document.getElementById("btn_adicionar");
    btnAdicionar.addEventListener("click", function() {
        var nome = document.getElementById("cliente_nome").value;
        var email = document.getElementById("cliente_email").value;
        var telefone = document.getElementById("cliente_telefone").value;
        insert_cliente_base(nome, email, telefone);
    });
}

function painel_cliente_busca() {
    limpa_tela();
    seleciona_botao("btn_clientes")

    var section = document.querySelector("header section");
    section.innerHTML = `<div id="painel">
                            <label for="Cliente">Cliente
                                <input class="bg_text" type="text" name="Cliente" id="cliente_nome">
                            </label>
                        </div>
                        <label class="switch">
                            <span class="slider"></span>
                            <input type="checkbox" checked id='sel_painel' onclick="selecino_painel(painel_cliente_busca, painel_cliente_cadastro, 'sel_painel')">
                            <span class="slider" data-label="Buscar" data-checked-label="Cadastrar"></span>
                        </label>
                        
                        <div id="btn_acoes">
                            <a href="#" id="btn_buscar">Buscar</a>
                        </div>
                        `;
    var btn_buscar = document.getElementById("btn_buscar");
    btn_buscar.addEventListener("click", function() {
        const txt_nome = document.getElementById("cliente_nome");
        const nome_digitado = txt_nome.value;
        popula_table_cliente_filtrada(nome_digitado)
    });    
}



/*  ----------------- REQUISIÇÕES DE ROTAS --------------------- */
/*  -=-=-=-=-=-=-=-=-        PRODUTOS      =-=-=-=-=-=-=-=-=-=-  */
//Função que busca todos os produtos
async function busca_produtos() {
    try {
        let url = links.busca_produtos;
        const response = await fetch(url, {
            method: 'get',
        });
        if (!response.ok) {
            throw new Error('Erro ao obter dados');
        }
        const dado = await response.json();
        return dado.produtos.map(item => ({
            id: item.id,
            Quantidade: item.quantidade,
            Produto: item.nome,
            Valor: item.valor
        }));
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function busca_produto(nome) {
    try {
        let url = links.busca_produto + nome;
        const response = await fetch(url, {
            method: 'get',
        });
        if (!response.ok) {
            throw new Error('Erro ao obter dados');
        }
        const dado = await response.json();
        return dado;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function delete_produto(nome) {
    if (confirm('Deseja excluir o produto?')) {
        let url = links.delete_produto + nome;
        fetch(url, {
            method: 'delete'
        })
        .then((response) => response.json())
        .then(() => {
            alert('Produto excluído com sucesso!');
            painel_produto_cadastro();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

const insert_produto_base = (nome, quantidade, preco) => {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('quantidade', quantidade);
    formData.append('valor', preco);
    let url = links.insert_produto_base;
    fetch(url, {
        method: 'post',
        body: formData
    }).then((res)=>{
        if (res.status == '200') {    
            popula_table_produto();
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    return false;
}

const atualiza_produto_base = (nome, quantidade, preco) => {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('quantidade', quantidade);
    formData.append('valor', preco);

    let url = links.atualiza_produto_base;
    fetch(url, {
        method: 'put',
        body: formData
    })
    .then((response) => {
        response.json()
        if (response.status == '200') {    
            popula_table_produto();
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    return false;
}

async function busca_clientes() {
    try {
        let url = links.busca_clientes;
        const response = await fetch(url, {
            method: 'get',
        });
        if (!response.ok) {
            throw new Error('Erro ao obter dados');
        }
        const dado = await response.json();
        return dado.clientes.map(item => ({
            id: item.id,
            nome: item.nome,
            endereco: item.endereco,
            telefone: item.telefone
        }));
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function busca_cliente(nome) {
    try {
        let url = links.busca_cliente + nome;
        const response = await fetch(url, {
            method: 'get',
        });
        if (!response.ok) {
            throw new Error('Erro ao obter dados');
        }
        const dado = await response.json();
        return dado.clientes.map(item => ({
            id: item.id,
            nome: item.nome,
            endereco: item.endereco,
            telefone: item.telefone
        }));
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function delete_cliente(id) {
    if (confirm('Deseja excluir o cliente?')) {
        let url = links.delete_cliente + id;
        fetch(url, {
            method: 'delete'
        })
        .then((response) => response.json())
        .then(() => {
            alert('Cliente excluído com sucesso!');
            painel_cliente_cadastro();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

function insert_cliente_base(nome, endereco, telefone) {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('endereco', endereco);
    formData.append('telefone', telefone);
    let url = links.insert_cliente_base;
    fetch(url, {
        method: 'post',
        body: formData
    }).then((res)=>{
        if (res.status == '200') {    
            popula_table_cliente();
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        return false;
    });
}

async function busca_proxima_venda() {
    try {
        let url = links.busca_proxima_venda;
        const response = await fetch(url, {
            method: 'get',
        });
        if (!response.ok) {
            throw new Error('Erro ao obter dados');
        }
        const dado = await response.json();
        return dado.venda_ultimo_id+1;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function busca_vendas(nome) {
    try {
        let url = links.busca_vendas + nome;
        const response = await fetch(url, {
            method: 'get',
        });
        if (!response.ok) {
            throw new Error('Erro ao obter dados');
        }
        const dado = await response.json();
        console.log(dado)
        return dado.vendas.map(item => ({
            venda_id: item.venda_id,
            nome: item.nome,
            quantidade: item.quantidade,
            valor: item.valor,
            data_venda: item.data_venda
        }));
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function insert_venda_base(cliente_id, produto_id, quantidade, venda_id) {
    const formData = new FormData();
    formData.append('cliente_id', cliente_id);
    formData.append('produto_id', produto_id);
    formData.append('quantidade', quantidade);
    formData.append('venda_id', venda_id);
    let url = links.insert_venda_base;
    fetch(url, {
        method: 'post',
        body: formData
    }).then((res)=>{
        if (res.status == '200') {    
            popula_table_vendas();
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        return false;
    });
}

/*  ----------------- CRIANDO E POPULANDO TABELAS --------------------- */
/* -=-=-=-=-=-==-=-=-           PRODUTOS          =-=-=-=-=-=-=-=-=-=-  */

async function popula_table_produto() {
    try {
        const data = await busca_produtos();
        var tableHead = document.getElementById("thead");
        tableHead.innerHTML = ` <tr>
        <th style="width: 100%;">Produto</th>
        <th>Quantidade</th>
        <th>Valor</th>
        <th>Apagar</th>
        </tr>`
        var tableBody = document.getElementById("tbody");
        tableBody.innerHTML = "";
        data.forEach(function(item, index) {
            tableBody.innerHTML += `<tr>
            <td>${item.Produto}</td>
            <td>${item.Quantidade}</td>
            <td>${item.Valor}</td>
            <td><button onclick="delete_produto('${item.Produto}')">Remover</button></td>
            </tr>`;
        });
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } 
}

async function popula_table_produto_filtrada(nome) {
    try {
        const data = await busca_produto(nome);
        var tableHead = document.getElementById("thead");
        tableHead.innerHTML = ` <tr>
        <th>Quantidade</th>
        <th style="width: 100%;">Produto</th>
        <th>Valor</th>
        <th>Apagar</th>
        </tr>`
        var tableBody = document.getElementById("tbody");
        tableBody.innerHTML += `<tr>
        <td>${data.nome}</td>
        <td>${data.quantidade}</td>
        <td>${data.valor}</td>
        <td><button onclick="delete_produto('${data.nome}')">Remover</button></td>
        </tr>`;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
    
}

/* -=-=-=-=-=-==-=-=-           CLIENTES          =-=-=-=-=-=-=-=-=-=-  */
function estrutura_tabela_cliente(data) {
    var tableHead = document.getElementById("thead");
        tableHead.innerHTML = ` <tr>
        <th>Id</th>
        <th>Nome</th>
        <th style="width: 100%;">Endereço</th>
        <th>Telefone</th>
        <th>Apagar</th>
        </tr>`
    var tableBody = document.getElementById("tbody");
    tableBody.innerHTML = "";
    data.forEach(function(item, index) {
        tableBody.innerHTML += `<tr>
        <td>${item.id}</td>
        <td>${item.nome}</td>
        <td>${item.endereco}</td>
        <td>${item.telefone}</td>
        <td><button onclick="delete_cliente('${item.id}')">Remover</button></td>
        </tr>`;
    });
}

async function popula_table_cliente() {
    try {
        const data = await busca_clientes();
        estrutura_tabela_cliente(data);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } 
}

async function popula_table_cliente_filtrada(nome) {
    try {
        const data = await busca_cliente(nome);
        estrutura_tabela_cliente(data);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } 
}

/* -=-=-=-=-=-=-=-=-           VENDAS             =-=-=-=-=-=-=-=-=-=-= */
function estrutura_tabela_venda(data) {
    var tableHead = document.getElementById("thead");
        tableHead.innerHTML = ` <tr>
        <th style="width: 70%;">PRODUTOS</th>
        <th style="width: 10%;">QUANTIDADE</th>
        <th style="width: 10%;">VALOR</th>
        <th  style="width: 70px;">APAGAR</th>
        </tr>`
    var tableBody = document.getElementById("tbody");
    tableBody.innerHTML = "";
    data.forEach(function(item, index) {
        tableBody.innerHTML += `<tr>
        <td>${item.nome_produto}</td>
        <td>${item.quantidade}</td>
        <td>${item.valor_produto}</td>
        <td><button onclick="delete_venda('${item.id}')">Remover</button></td>
        </tr>`;
    });
}

function estrutura_tabela_venda_busca(data) {
    var tableHead = document.getElementById("thead");
        tableHead.innerHTML = ` <tr>
        <th style="width: 10px;">VENDA</th>
        <th style="width: 400px;">PRODUTO</th>
        <th style="width: 15px;">QUANTIDADE</th>
        <th  style="width: 20px;">VALOR</th>
        <th  style="width: 250px;">DATA DA VENDA</th>
        </tr>`
    var tableBody = document.getElementById("tbody");
    tableBody.innerHTML = "";
    data.forEach(function(item, index) {
        console.log(item)
        tableBody.innerHTML += `<tr>
        <td>${item.venda_id}</td>
        <td>${item.nome}</td>
        <td>${item.quantidade}</td>
        <td>${item.valor}</td>
        <td>${item.data_venda}</td>
        </tr>`;
    });
}

async function popula_table_vendas() {
    try {
        const data = await get_carrinho();
        popula_total();
        estrutura_tabela_venda(data);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } 
}

async function popula_table_venda(id_cliente) {
    try {
        const data = await busca_vendas(id_cliente);
        estrutura_tabela_venda_busca(data);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } 
}