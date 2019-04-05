import sqlite3
import ast


connection = sqlite3.connect('participants.db')
cursor = connection.cursor()
cursor.execute("SELECT * FROM turkdemo") #turkdemo
results = cursor.fetchall()
map_str = lambda x: ','.join(map(str, x))

null=None
true=True
false=False

#output = []
header = ['worker_id','assignment_id','uniqueid','condition','pid','datetime',
            'trial_id','exp_dur','noise_dur',"wait_dur", 'loc_x','loc_y','n_shown',
            'n_guess','rt']
output = [map_str(header)]

t_num = 0
for r in results:
    #print r

    #try:
    #dic = eval(r[16].encode('ascii','ignore'))
    #dic = r[16].encode('ascii','ignore')
    try:
        dic= eval(r[len(r)-1].encode('ascii', 'ignore'))
    #except:
      #  pass

        if 'data' in dic:
            trial = dic['data'] 


            for t in trial:
                print t["trialdata"]

                header = [x for x in t]
                tt = t['trialdata']
                if tt['phase']=='TEST':
                    if 'debug' not in dic['workerId'] and "A19S8APZYIU1AC" not in dic["workerId"]:

                        out = [dic['workerId'],dic['assignmentId'],
                             t['uniqueid'],tt['condition'],tt['pid'],t['dateTime'],
                             tt['trial_id'],    tt['exp_dur'],tt['noise_dur'],tt["wait_dur"],
                             tt['loc_x'], tt['loc_y'],
                              tt['n_shown'], tt['n_guess'],tt['rt']]
                    output.append(map_str(out))
                    t_num += 1
    except:
        print "FAIL"

   # except:
     #   print "didn't work"
      #  pass    

for o in output:
    print o
with open('data.csv','w') as f:
    f.write('\n'.join(output))
    f.close()
    
with open('results/data.csv','w') as f:
    f.write('\n'.join(output))
    f.close()
    

