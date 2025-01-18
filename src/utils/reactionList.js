const reactions = ['like','celebrate','support','insightful','funny','love']
const reactionList = []
for (const react of reactions) {
 reactionList.push({path:`reactions.${react}`,select:'userName email'})
}
export default reactionList