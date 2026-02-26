const { baseTemplate } = require("./baseTemplate")

exports.registerTemplate = ({ name, password }) => {
    const content = `
        <h2>Welcome to SKILLHUB</h2>
        <p> Hi,${name} </p>
        <div> Your Temporary password is  <h1>${password}</h1> </div>
        <p> Thank you for choosing SKILLHUB. </p>
    `
    return baseTemplate({
        title: "welcome to SKILLHUB",
        content
    })
}