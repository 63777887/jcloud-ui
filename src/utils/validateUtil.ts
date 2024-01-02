// 手机号校验规则
export const validatePhone = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入手机号'))
    } else {
        // 手机号正则表达式
        const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
        // 验证手机号
        if (!reg.test(value)) {
            callback(new Error('手机号格式错误'))
        } else {
            callback()
        }
    }
}

// 邮箱校验规则
export const validateEmail = (rule, value, callback) => {
    const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (!value) {
        return callback(new Error("邮箱不能为空"));
    }
    setTimeout(() => {
        if (mailReg.test(value)) {
            callback();
        } else {
            callback(new Error("请输入正确的邮箱格式"));
        }
    }, 100);
};
