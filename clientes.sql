cliente{
CREATE TABLE cliente (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(50) NOT NULL,
        cpf CHAR(14) NOT NULL UNIQUE,
        email VARCHAR(50) NOT NULL UNIQUE,
        celular CHAR(14) NOT NULL,
        senha VARCHAR(512) NOT NULL
);


# excluir
DROP TABLE cliente;


# inserir 12 clientes
INSERT INTO cliente (
       nome, cpf, email, celular, senha
) VALUES (
       'Hilda Folk', '148.211.069-57', 'hilda.folk@escola.pr.gov.br',
       '(42)99931-8655', 'trollberg_safety1'
),
(
       'Ayumu Fujino', '280.267.098-89', 'ayumu.fujino@escola.pr.gov.br',
       '(41)99876-5432', 'manga_artist_01!'
),
(
       'Kyomoto Kyoshin', '289.411.765-89', 'kyomoto.k@escola.pr.gov.br',
       '(43)99123-4567', 'look_back_2026'
),
(
       'Kris Dreemurr', '712.304.598-44', 'kris.dreemurr@escola.pr.gov.br',
       '(42)98877-6655', 'darkworld_hero'
),
(
       'Susie Monster', '103.542.899-21', 'susie.m@escola.pr.gov.br',
       '(44)99765-1122', 'chalk_eater_99'
),
(
       'Ralsei Prince', '365.812.407-33', 'ralsei.prince@escola.pr.gov.br',
       '(45)99144-8899', 'fluffy_boy#123'
),
(
       'Frida Alchemist', '824.195.630-76', 'frida.a@escola.pr.gov.br',
       '(41)98433-2211', 'sparrow_scout_leader'
),
(
       'David Sparrow', '501.277.643-05', 'david.sparrow@escola.pr.gov.br',
       '(46)99911-5544', 'bug_collector_26'
),
(
       'Noelle Holiday', '639.408.115-92', 'noelle.h@escola.pr.gov.br',
       '(42)99822-3344', 'snowgrave_ice_92'
),
(
       'Berdly Bird', '198.533.720-68', 'berdly.bird@escola.pr.gov.br',
       '(43)99155-7788', 'gamer_god_alphax'
),
(
       'Spamton G. Spamton', '942.610.357-11', 'spamton.g@escola.pr.gov.br',
       '(44)98844-3322', 'big_shot_1997!!'
),
(
       'Alphys Lizard', '257.894.130-80', 'alphys.l@escola.pr.gov.br',
       '(45)99711-6677', 'mew_mew_love_2'
);


INSERT INTO cliente (
       id, nome, cpf, email, celular, senha
) VALUES (
       1, 'Hilda Folk', '148.211.069-57', 'hilda.folk@escola.pr.gov.br',
       '(42)99931-8655', 'trollberg_safety1'
),
(
       2, 'Ayumu Fujino', '452.189.302-12', 'ayumu.fujino@escola.pr.gov.br',
       '(41)99876-5432', 'manga_artist_01!'
),
(
       3, 'Kyomoto Kyoshin', '289.411.765-89', 'kyomoto.k@escola.pr.gov.br',
       '(43)99123-4567', 'look_back_2026'
),
(
       4, 'Kris Dreemurr', '712.304.598-44', 'kris.dreemurr@escola.pr.gov.br',
       '(42)98877-6655', 'darkworld_hero'
),
(
       5, 'Susie Monster', '103.542.899-21', 'susie.m@escola.pr.gov.br',
       '(44)99765-1122', 'chalk_eater_99'
),
(
       6, 'Ralsei Prince', '365.812.407-33', 'ralsei.prince@escola.pr.gov.br',
       '(45)99144-8899', 'fluffy_boy#123'
),
(
       7, 'Frida Alchemist', '824.195.630-76', 'frida.a@escola.pr.gov.br',
       '(41)98433-2211', 'sparrow_scout_leader'
),
(
       8, 'David Sparrow', '501.277.643-05', 'david.sparrow@escola.pr.gov.br',
       '(46)99911-5544', 'bug_collector_26'
),
(
       9, 'Noelle Holiday', '639.408.115-92', 'noelle.h@escola.pr.gov.br',
       '(42)99822-3344', 'snowgrave_ice_92'
),
(
       10, 'Berdly Bird', '198.533.720-68', 'berdly.bird@escola.pr.gov.br',
       '(43)99155-7788', 'gamer_god_alphax'
),
(
       11, 'Spamton G. Spamton', '942.610.357-11', 'spamton.g@escola.pr.gov.br',
       '(44)98844-3322', 'big_shot_1997!!'
),
(
       12, 'Alphys Lizard', '257.894.130-80', 'alphys.l@escola.pr.gov.br',
       '(45)99711-6677', 'mew_mew_love_2'
);
