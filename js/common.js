/**
 * Created by voson on 2017/4/24.
 */

function bubbleSort(arr,key) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j][key] < arr[j+1][key]) {        //相邻元素两两对比
                let temp = arr[j+1];        //元素交换
                arr[j+1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

function removeItem(arr,ids) {
    let a=[],c=JSON.parse(JSON.stringify(arr));
    c.forEach(function (item) {
        ids.every(function (b) {
            if(b!==item.id){
                a.push(item);
                return false;
            }
            return true;
        })
    });
    return a;
}


