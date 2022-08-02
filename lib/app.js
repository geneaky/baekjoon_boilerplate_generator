exports.cli = () => {
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

let configFile;
try{
    configFile = fs.readFileSync("config.json", 'utf8');
}catch (err) {
    fs.writeFileSync("config.json","{}");
    configFile = fs.readFileSync("config.json", 'utf8');
}
const configData = JSON.parse(configFile);

if(!configData.project_path || !configData.package_name || !configData.language_type) {
    commander.action((cmd,args) => {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'project_path',
                    message: '프로젝트 경로를 입력하세요',
                },
                {
                    type: 'input',
                    name: 'package_name',
                    message: '패키지명을 입력하세요',
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
                if(!answer.project_path || !answer.package_name || !answer.language_type || !answer.problem_id) {
                    console.log(chalk.red('Command Not Found'));
                    return;
                }
                bar.tick();
                makeProblemAfterSetting(answer.project_path, answer.package_name, answer.language_type, answer.problem_id);
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
            if(!answer.problem_id) {
                console.log(chalk.red('Command Not Found'));
                return;
            }
            bar.tick()
            makeProblemClass(answer.problem_id);
            if(bar.complete) {
                console.log(chalk.yellow('\ncomplete\n'));
            }
        })
    })
        .parse(process.argv);
}

const makeProblemAfterSetting = (project_path, package_name, language_type, problem_id) => {
    configData.project_path = project_path;
    configData.package_name = package_name;
    configData.language_type = language_type;
    fs.writeFileSync("./config.json", JSON.stringify(configData));

    fs.mkdirSync(project_path+"/"+package_name+"/bj"+problem_id,{recursive : true},(err) => {
        console.log(err)
    })

    if(language_type == "Java") {
        fs.writeFileSync(project_path+"/"+package_name+"/bj"+problem_id+"/Main.java", getJavaTemplate(project_path,package_name,problem_id));
        fs.writeFileSync(project_path+"/"+package_name+"/bj"+problem_id+"/input.txt", "");
    }else if (language_type == "Kotlin") {
        fs.writeFileSync(project_path+"/"+package_name+"/bj"+problem_id+"/Main.kt", getKotlinTemplate(project_path,package_name,problem_id));
        fs.writeFileSync(project_path+"/"+package_name+"/bj"+problem_id+"/input.txt", "");
    }
}
const makeProblemClass = (problem_id) => {

    fs.mkdirSync(configData.project_path+"/"+configData.package_name+"/bj"+problem_id,{recursive : true},(err) => {
        console.log(err)
    })

    if(configData.language_type == "Java") {
        fs.writeFileSync(configData.project_path+"/"+configData.package_name+"/bj"+problem_id+"/Main.java", getJavaTemplate(configData.project_path,configData.package_name,problem_id));
        fs.writeFileSync(configData.project_path+"/"+configData.package_name+"/bj"+problem_id+"/input.txt","");
    }else if (configData.language_type == "Kotlin") {
        fs.writeFileSync(configData.project_path+"/"+configData.package_name+"/bj"+problem_id+"/Main.kt", getKotlinTemplate(configData.project_path,configData.package_name,problem_id));
        fs.writeFileSync(configData.project_path+"/"+configData.package_name+"/bj"+problem_id+"/input.txt","");
    }
}

const getJavaTemplate = (project_path, package_name, problem_id) => {
    return `package ${package_name+".bj"+problem_id};

import java.util.*;
import java.io.*;

public class Main {

    public static void main(String[] args) throws IOException {
        System.setIn(new FileInputStream("${project_path+"/"+package_name+"/b"+problem_id+"/input.txt"}"));
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

        StringTokenizer st = new StringTokenizer(br.readLine());

    }
}`
}

const getKotlinTemplate = (project_path, package_name, problem_id) => {
    return "";
}
}
