//  https:// eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    //  https:// github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    //  consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    //  https:// github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  //  required to lint *.vue files
  plugins: [
    'vue'
  ],
  //  add your custom rules here
  rules: {
    //  allow async-await
    'generator-star-spacing': 'off',
    //  allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    //  donot check extra semicolon
    'semi': [0],
    //  check extra semicolon
    // 'semi': ["error", "always"],
    //  use double quotes
    'quotes': [0, "double"],// 引号类型 `` "" ''
    // 空行最多不能超过100行
    "no-multiple-empty-lines": [0, {"max": 100}],
    // 关闭禁止混用tab和空格
    "no-mixed-spaces-and-tabs": [0],
    // 关闭方法名和刮号之间需要有一格空格
    "space-before-function-paren": 0,
    // 可以用tab
    "no-tabs": 'off',
    // 可以用 ==
    'eqeqeq': [0],
    // 不校验缩进
    'indent': [0]
  }
}
