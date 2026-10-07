const db = require("./db")

async function criar_estrutura() {
    try{
        await db.pool.query(`
        DROP TABLE IF EXISTS cliente;
        CREATE TABLE cliente (
            id int NOT NULL AUTO_INCREMENT,
            nome varchar(50) NOT NULL,
            cpf char(14) NOT NULL,
            email varchar(50) NOT NULL,
            celular char(14) NOT NULL,
            senha varchar(512) NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY cpf (cpf),
            UNIQUE KEY email (email)
          ) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;
        INSERT INTO cliente VALUES
          (13,'Shigeo Kageyama','000.100.100-00','shigeo.mob@saltmiddle.edu.jp','11910001000','$2b$10$nwAtfeTMVQLaTXScFonsZOXyK5kgzG6LFT29EpaV/g1dg8lFiBXp.'),
          (14,'Guilherme Luiz','148.211.069-39','G@seila.com','(42)99931-8655','$2b$10$I0/r3J2d2xjydtam3xOVSe/sZWktY8S59wVlHhqwD0gdfTLosU0Ni');
        `)
        console.log("Migration de estrutura do BD finalizada!!!")
        process.exit(0);
    } catch (error){
        console.log(error)
        process.exit(1);
    }
}

criar_estrutura()