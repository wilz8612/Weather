using App.Windows.Controls;
using System;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using Weather.Members;
using Weather.Resources;
using Weather.Windows;

namespace Weather.Windows
{
    public class FormProvider
    {
        public static AutoGrid MemberForm(FormBuilder<Member> formBuilder)
        {
            AutoGrid form = new AutoGrid(2, 100, 250)
            {
                Children =
                    {
                        formBuilder.Label(r=>r.Code),formBuilder.Input(r=>r.Code),
                        formBuilder.Label(r => r.Name),formBuilder.Input(r => r.Name),
                        formBuilder.Label(r => r.NickName),formBuilder.Input(r => r.NickName),
                        formBuilder.Label(r => r.Mobile),formBuilder.Input(r => r.Mobile),
                        formBuilder.Label(r => r.Email),formBuilder.Input(r => r.Email),
                        formBuilder.Label(r=>r.City),formBuilder.View(r=>r.City),
                    }
            };
            return form;
        }
        public static AutoGrid ScratchPrizeForm(FormBuilder<ScratchPrizeRule> formBuilder)
        {
            AutoGrid form = new AutoGrid(2, 100, 250)
            {
                Children =
                    {
                        formBuilder.Label(r=>r.PrizeType),formBuilder.Input(r=>r.PrizeType),
                        formBuilder.Label(r => r.Name),formBuilder.Input(r => r.Name),
                        formBuilder.Label(r => r.ConsumePoints),formBuilder.Input(r => r.ConsumePoints),
                        formBuilder.Label(r => r.Chance),formBuilder.Input(r => r.Chance),
                        formBuilder.Label(r => r.PrizeValue),formBuilder.Input(r => r.PrizeValue),
                        formBuilder.Label(r=>r.Description),formBuilder.View(r=>r.Description),
                    }
            };
            return form;
        }
        public static AutoGrid WeatherBackgroudForm(FormBuilder<WeatherBackgroud> formBuilder)
        {
            AutoGrid form = new AutoGrid(2, 100, 250)
            {
                Children =
                    {
                        formBuilder.Label(r => r.Name),formBuilder.Input(r => r.Name),
                        formBuilder.Label(r => r.Path),formBuilder.Input(r => r.Path),
                        formBuilder.Label(r => r.AvilableTime),formBuilder.Input(r => r.AvilableTime),
                    }
            };
            return form;
        }
    }
}
    
