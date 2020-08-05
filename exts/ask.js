module.exports = function askCreator(template = "") {
  return [
    {
      type: "input",
      name: "proName",
      message: "项目名",
      default: "autorun",
      validate(input) {
        const done = this.async();
        if (input.trim().length === 0) {
          done("项目名不能为空");
          return;
        }
        done(null, true);
      },
    },
    {
      type: "input",
      name: "moduleName",
      message: "模块名",
      validate(input) {
        const done = this.async();
        if (input.trim().length === 0) {
          done("模块名不能为空");
          return;
        }
        done(null, true);
      },
    },
    {
      type: "input",
      name: "pageName",
      message: "页面名",
      default: template,
      validate(input) {
        const done = this.async();
        if (input.trim().length === 0) {
          done("页面名不能为空");
          return;
        }
        done(null, true);
      },
    },
  ];
};
