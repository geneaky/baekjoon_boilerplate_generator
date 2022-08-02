const {Command} = require('commander');
const fs = require('fs');
const chalk = require('chalk');
const Progress = require('progress');
const inquirer = require('inquirer');

const commander = new Command();
const bar = new Progress('running [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: 1
});
const configFile = fs.readFileSync("./config.json", 'utf8');
const configData = JSON.parse(configFile);

const makeProblemAfterSetting = (project_path, package_name, problem_id) => {
    console.log('hi');
}
const makeProblemClass = (problem_id) => {
    console.log('hi');
}

if(!configData.project_path && !configData.package_name) {
    commander.action((cmd,args) => {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'project_path',
                    message: '프로젝트 경로를 입력하세요',
                    default: '.',
                },
                {
                    type: 'input',
                    name: 'package_name',
                    message: '패키지명을 입력하세요',
                    default: '.',
                },
                {
                    type: 'list',
                    name: 'language_type',
                    message: '사용언어를 선택하세요',
                    choices: ['Java', 'Kotlin']
                },
                {
                    type: 'input',
                    name: 'problem_id',
                    message: '문제 번호를 입력하세요',
                    default: 'XXX',
                }
            ]).then((answer) => {
                bar.tick();
                makeProblemAfterSetting(answer.project_path,answer.package_name, problem_id);
                if(bar.complete) {
                    console.log(chalk.yellow('\ncomplete\n'));
                }

            })
        })
        .parse(process.argv);

}else{
    commander.action((cmd,args) => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'problem_id',
                message: '문제 번호를 입력하세요',
                default: 'XXX',
            }
        ]).then((answer) => {
            bar.tick()
            makeProblemClass(problem_id);
            if(bar.complete) {
                console.log(chalk.yellow('\ncomplete\n'));
            }
        })
    })
        .parse(process.argv);
}
//세팅 단계 - 프로젝트 위치 (현재위치로 하시겠습니까?) , 패키지명
    //세팅 수정 옵션을 따로 주고 추후 수정 가능
    //세팅이 되어 있으면 이 질문은 다시 물어보지 않는다.
    //패키지 위치 입력 src/main/java/{project_name}//

//백준 번호 입력
//타입 선택 1. java , 2. kotlin,