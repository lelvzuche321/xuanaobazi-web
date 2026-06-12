/**
 * Script Engine - Original DSL Interpreter for 玄奥八字 scripts
 * 脚本解释器 - 兼容原软件的脚本语言
 */
const ScriptEngine = (function() {
    'use strict';

    /**
     * Parse and execute a script against a BaZi chart
     * @param {string} script - The script text
     * @param {Object} chart - The BaZi chart result from BaziEngine.calculate()
     * @returns {Array} Array of output strings
     */
    function execute(script, chart) {
        const outputs = [];
        const vars = {};
        const B = BaziEngine;

        // Context for script execution
        const ctx = {
            chart,
            outputs,
            vars,
            // DSL functions
            日干: () => chart.dayPillar.stemName,
            日支: () => chart.dayPillar.branchName,
            年干: () => chart.yearPillar.stemName,
            年支: () => chart.yearPillar.branchName,
            月干: () => chart.monthPillar.stemName,
            月支: () => chart.monthPillar.branchName,
            时干: () => chart.hourPillar.stemName,
            时支: () => chart.hourPillar.branchName,
            性别: () => chart.gender === 'male' ? '男' : '女',
            生肖: () => chart.yearPillar.animal,
            日干是: (s) => chart.dayPillar.stemName === s,
            日支是: (s) => chart.dayPillar.branchName === s,
            年干是: (s) => chart.yearPillar.stemName === s,
            月干是: (s) => chart.monthPillar.stemName === s,
            时干是: (s) => chart.hourPillar.stemName === s,
            性别是: (s) => (chart.gender === 'male' ? '男' : '女') === s,
            生肖是: (s) => chart.yearPillar.animal === s,
            年数: () => new Date().getFullYear() - chart.yearPillar.branch + 4,
            输出: (s) => { outputs.push(s); },
            变量赋值: (name, val) => { vars[name] = val; },
            变量取值: (name) => vars[name] || 0,
            起运: () => chart.startAge,
            大运干支: (n) => {
                const idx = Math.floor((n - chart.startAge) / 10);
                if (idx >= 0 && idx < chart.bigLuckPillars.length) {
                    const p = chart.bigLuckPillars[idx];
                    return p.stemName + p.branchName;
                }
                return '';
            },
            流年干支: (n) => {
                const cy = chart.chineseYear + n;
                const idx = ((cy - 4) % 60 + 60) % 60;
                return B.STEMS[idx % 10] + B.BRANCHES[idx % 12];
            },
            五行: (s) => {
                const idx = B.STEMS.indexOf(s);
                if (idx >= 0) return B.ELEM_NAMES[B.STEMS.indexOf(s) % 2 === 0 ? B.STEMS.indexOf(s) / 2 : B.STEMS.indexOf(s) / 2];
                return '';
            },
            十神: (stem, branch) => {
                const sIdx = B.STEMS.indexOf(stem);
                if (sIdx >= 0) {
                    const tg = B.getTenGod(chart.dayPillar.stem, sIdx);
                    return B.TEN_GODS[tg];
                }
                return '';
            },
            空亡: (branch) => {
                const bIdx = B.BRANCHES.indexOf(branch);
                return chart.emptyBranches.includes(bIdx);
            },
            纳音: (stem, branch) => {
                const sIdx = B.STEMS.indexOf(stem);
                const bIdx = B.BRANCHES.indexOf(branch);
                if (sIdx >= 0 && bIdx >= 0) {
                    return B.getNaYin(sIdx * 12 + bIdx);
                }
                return '';
            }
        };

        try {
            // Simple script parser
            parseAndExecute(script, ctx);
        } catch (e) {
            outputs.push('[Script Error: ' + e.message + ']');
        }

        return outputs;
    }

    function parseAndExecute(script, ctx) {
        const lines = script.split('\n');
        let i = 0;
        const stack = [];

        while (i < lines.length) {
            let line = lines[i].trim();

            // Skip comments and empty lines
            if (!line || line.startsWith('//') || line.startsWith('#')) {
                i++;
                continue;
            }

            // Remove comments at end of line
            const commentIdx = line.indexOf('//');
            if (commentIdx > 0) {
                line = line.substring(0, commentIdx).trim();
            }

            // Variable declarations
            if (line.startsWith('int ') || line.startsWith('string ')) {
                const parts = line.split(/[ ,;]+/);
                for (let j = 1; j < parts.length; j++) {
                    if (parts[j] && !parts[j].startsWith('//')) {
                        ctx.vars[parts[j].replace(';', '')] = 0;
                    }
                }
                i++;
                continue;
            }

            // Function definition
            if (line.includes('()') && line.includes('{')) {
                i++;
                continue;
            }

            // Closing brace
            if (line === '}') {
                i++;
                continue;
            }

            // Execute statements
            executeStatement(line, ctx);
            i++;
        }
    }

    function executeStatement(line, ctx) {
        // 输出()
        if (line.startsWith('输出(')) {
            const match = line.match(/输出\((.+)\)/);
            if (match) {
                const content = evalExpression(match[1], ctx);
                ctx.outputs.push(String(content));
            }
            return;
        }

        // 变量赋值 = 表达式
        if (line.includes('=') && !line.includes('==') && !line.includes('!=')) {
            const parts = line.split('=');
            const varName = parts[0].trim();
            const expr = parts.slice(1).join('=').trim();
            const val = evalExpression(expr, ctx);
            ctx.vars[varName] = val;
            return;
        }

        // if 条件
        if (line.startsWith('if')) {
            // Handle simple if statements
            return;
        }

        // while 循环
        if (line.startsWith('while')) {
            return;
        }
    }

    function evalExpression(expr, ctx) {
        expr = expr.trim();

        // Remove trailing semicolon
        if (expr.endsWith(';')) expr = expr.slice(0, -1).trim();

        // String literal
        if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
            return expr.slice(1, -1);
        }

        // Number literal
        if (/^-?\d+(\.\d+)?$/.test(expr)) {
            return parseFloat(expr);
        }

        // Variable reference
        if (ctx.vars[expr] !== undefined) {
            return ctx.vars[expr];
        }

        // Function call
        const funcMatch = expr.match(/^(\w+)\((.+)\)$/);
        if (funcMatch) {
            const funcName = funcMatch[1];
            const args = funcMatch[2].split(',').map(a => evalExpression(a.trim(), ctx));

            if (ctx[funcName]) {
                return ctx[funcName](...args);
            }

            // Try built-in functions
            switch (funcName) {
                case '日干是': return ctx.日干是(args[0]);
                case '日支是': return ctx.日支是(args[0]);
                case '年干是': return ctx.年干是(args[0]);
                case '月干是': return ctx.月干是(args[0]);
                case '时干是': return ctx.时干是(args[0]);
                case '性别是': return ctx.性别是(args[0]);
                case '生肖是': return ctx.生肖是(args[0]);
                case '日干': return ctx.日干();
                case '日支': return ctx.日支();
                case '年干': return ctx.年干();
                case '月干': return ctx.月干();
                case '时干': return ctx.时干();
                case '性别': return ctx.性别();
                case '生肖': return ctx.生肖();
                case '年数': return ctx.年数();
                case '起运': return ctx.起运();
                default: return expr;
            }
        }

        // Logical operators (simplified)
        if (expr.includes('&&')) {
            const parts = expr.split('&&');
            return parts.every(p => evalExpression(p.trim(), ctx));
        }
        if (expr.includes('||')) {
            const parts = expr.split('||');
            return parts.some(p => evalExpression(p.trim(), ctx));
        }

        // Comparison operators
        if (expr.includes('==')) {
            const parts = expr.split('==');
            return evalExpression(parts[0].trim(), ctx) == evalExpression(parts[1].trim(), ctx);
        }
        if (expr.includes('!=')) {
            const parts = expr.split('!=');
            return evalExpression(parts[0].trim(), ctx) != evalExpression(parts[1].trim(), ctx);
        }
        if (expr.includes('>=')) {
            const parts = expr.split('>=');
            return evalExpression(parts[0].trim(), ctx) >= evalExpression(parts[1].trim(), ctx);
        }
        if (expr.includes('<=')) {
            const parts = expr.split('<=');
            return evalExpression(parts[0].trim(), ctx) <= evalExpression(parts[1].trim(), ctx);
        }
        if (expr.includes('>')) {
            const parts = expr.split('>');
            return evalExpression(parts[0].trim(), ctx) > evalExpression(parts[1].trim(), ctx);
        }
        if (expr.includes('<')) {
            const parts = expr.split('<');
            return evalExpression(parts[0].trim(), ctx) < evalExpression(parts[1].trim(), ctx);
        }

        // Arithmetic
        if (expr.includes('+')) {
            const parts = expr.split('+');
            return evalExpression(parts[0].trim(), ctx) + evalExpression(parts[1].trim(), ctx);
        }
        if (expr.includes('-')) {
            const parts = expr.split('-');
            return evalExpression(parts[0].trim(), ctx) - evalExpression(parts[1].trim(), ctx);
        }

        return expr;
    }

    return {
        execute
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScriptEngine;
}