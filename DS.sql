DROP TABLE Cliente;
CREATE TABLE Cliente 
( 
 ID INT PRIMARY KEY AUTO_INCREMENT,  
 celular CHAR (14) NOT NULL,  
 email VARCHAR (200) NOT NULL,  
 cpf CHAR (14) NOT NULL UNIQUE,  
 nome VARCHAR (100) NOT NULL,  
 senha VARCHAR (255) NOT NULL  
); 

CREATE TABLE Compra 
( 
 idCliente INT,  
 idEndereço INT,  
 data DATE NOT NULL,  
 forma_pagamento VARCHAR (200) NOT NULL,  
 valor_total FLOAT NOT NULL  
); 

CREATE TABLE Produto 
( 
 ID INT PRIMARY KEY,  
 caminho_img VARCHAR (100) NOT NULL,  
 preço VARCHAR (20),
 categoria VARCHAR (30) NOT NULL,  
 descrição VARCHAR (500) NOT NULL,  
 nome VARCHAR (100) NOT NULL,  
 quantidade_img INT NOT NULL 
); 

CREATE TABLE Endereço 
( 
 idCliente INT,  
 rua VARCHAR (300) NOT NULL,  
 numero INT,  
 bairro VARCHAR (200) NOT NULL,  
 cidade VARCHAR (100) NOT NULL,  
 estado VARCHAR (100) NOT NULL,
 UNIQUE (numero)
); 

CREATE TABLE Possui 
(
 ID INT,  
 quantidade INT,  
 valor_unitario FLOAT NOT NULL  
); 

ALTER TABLE Compra ADD FOREIGN KEY(idCliente) REFERENCES Cliente (idCliente)
ALTER TABLE Compra ADD FOREIGN KEY(idEndereço) REFERENCES Endereço (idEndereço)
ALTER TABLE Endereço ADD FOREIGN KEY(idCliente) REFERENCES Cliente (idCliente)
ALTER TABLE Possui ADD FOREIGN KEY(ID) REFERENCES Compra (ID)
ALTER TABLE Possui ADD FOREIGN KEY(ID) REFERENCES Produto (ID)
