

# canvas的globalCompositeOperation

`globalCompositeOperation `属性设置或返回如何将一个源（新的）图像绘制到目标（已有）的图像上(即设置了源图像与像图片的显示问题)

第一个画出来的叫做目标图像,后面绘制的叫做源图像

1. source-over:默认值.在目标图像上显示源图像(即源图像与新图像的重合地方显示的是新图像部分)

   ![image-20210622223129762](C:\Users\Administrator\Desktop\markdown笔记\canvas笔记\images\1.png)

2. source-atop:在目标图像顶部显示源图像.源图像位于目标图像之外的部分是不可见的![image-20210622223505391](C:\Users\Administrator\Desktop\markdown笔记\canvas笔记\images\2.png)

3. souce-in:在目标图像中显示源图像.只有目标图像内的源图像部分,目标图像是透明的

   ![image-20210622223757043](C:\Users\Administrator\Desktop\markdown笔记\canvas笔记\images\3.png)

4. destination-over:在源图像上方显示目标图像

   ![image-20210622224011435](C:\Users\Administrator\Desktop\markdown笔记\canvas笔记\images\4.png)

5. destination-atop:在源图像顶部显示目标图像。源图像之外的目标图像部分不会被显示

   ![image-20210622224201153](C:\Users\Administrator\Desktop\markdown笔记\canvas笔记\images\5.png)

6. destination-in:在源图像中显示目标图像。只有源图像内的目标图像部分会被显示，源图像是透明的

   ![image-20210622224254314](C:\Users\Administrator\Desktop\markdown笔记\canvas笔记\images\6.png)

7. destination-out:在源图像外显示目标图像。只有源图像外的目标图像部分会被显示，源图像是透明的

   ![image-20210622224404167](C:\Users\Administrator\Desktop\markdown笔记\canvas笔记\images\7.png)

8. lighter:显示源图像 + 目标图像。

   ![](C:\Users\Administrator\Desktop\markdown笔记\canvas笔记\images\8.png)

   

9. copy:显示源图像。忽略目标图像。

   ![image-20210622224755098](C:\Users\Administrator\Desktop\markdown笔记\canvas笔记\images\9.png)

10. xor:使用异或操作对源图像与目标图像进行组合

    ![image-20210622224836379](C:\Users\Administrator\Desktop\markdown笔记\canvas笔记\images\10.png)