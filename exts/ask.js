module.exports = function askCreator(template = "") {
  return [
    {
      type: "input",
      name: "proName",
      message: "项目名(en)",
      default: "autorun",
      validate(input) {
        const done = this.async();
        if (input.trim().length === 0) {
          done("路径项目名不能为空");
          return;
        }
        done(null, true);
      },
    },
    {
      type: "input",
      name: "moduleName",
      message: "模块名(en)",
      validate(input) {
        const done = this.async();
        if (input.trim().length === 0) {
          done("路径模块名不能为空");
          return;
        }
        done(null, true);
      },
    },
    {
      type: "input",
      name: "pageName",
      message: "页面名(en)",
      default: template,
      validate(input) {
        const done = this.async();
        if (input.trim().length === 0) {
          done("路径页面名不能为空");
          return;
        }
        done(null, true);
      },
    },,
    {
      type: "input",
      name: "name",
      message: "页面名Title(cn)",
      default: '表单及目录示范',
    },
  ];
};
